import { expect, test } from  '@playwright/test'
import { createBlog, login } from './utils/helper'

const mockUser = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
}

const mockBlog = {
    title: 'title',
    author: 'author',
    url: 'https://url'
}

test.describe('Blog app', () => {
    test.beforeEach(async ({ page, request }) => {
        await request.post('/api/reset')
        await request.post('/api/users', {
            data: mockUser
        })
        await page.goto('/')
    })

    test('Login form is shown by default', async ({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible()
        const usernameField = page.getByLabel('username')
        await expect(usernameField).toBeVisible()
        await expect(usernameField).toBeEditable()

        const passwordField = page.getByLabel('password')
        await expect(passwordField).toBeVisible()
        await expect(passwordField).toBeEditable()
    })


    test.describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await login(page, mockUser.username, mockUser.password)
            await expect(page.getByText(`${mockUser.name} logged in`)).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await login(page, mockUser.username, 'wrong')
            await expect(page.getByText('wrong credentials')).toBeVisible()
            await expect(page.getByText(`${mockUser.name} logged in`)).not.toBeVisible()
        })
    })

    test.describe('When logged in', () => {
        test.beforeEach(async ({ page }) => {
            await login(page, mockUser.username, mockUser.password)
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, mockBlog.title, mockBlog.author, mockBlog.url)

            await expect(page.getByText('title author')).toBeVisible()
            await expect(page.getByRole('button', { name: 'View' })).toBeVisible()
        })

        test('like button verification', async ({ page }) => {
            await createBlog(page, mockBlog.title, mockBlog.author, mockBlog.url)
            await page.getByRole('button', { name: 'View' }).click()

            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByTestId('likes')).toContainText('1')
        })

        test('user can delete own blogs', async ({ page }) => {
            await createBlog(page, mockBlog.title, mockBlog.author, mockBlog.url)
            await page.getByRole('button', { name: 'View' }).click()

            const deleteBtn = page.getByRole('button', { name: 'remove' })
            await expect(deleteBtn).toBeVisible()
            await expect(deleteBtn).toBeEnabled()

            page.on('dialog', dialog => dialog.accept())
            await deleteBtn.click()

            await expect(page.getByText('title author')).not.toBeVisible()
        })

        test('user cannot delete own blogs', async ({ page, request }) => {
            await createBlog(page, mockBlog.title, mockBlog.author, mockBlog.url)
            await page.getByText('Logout').click()

            const secondUser= {
                name: 'John Doe',
                username: 'Jdd',
                password: '123456789'
            }
            await request.post('/api/users', { data: secondUser })
            await login(page, secondUser.username, secondUser.password)
            await page.getByRole('button', { name: 'View' }).click()

            const deleteBtn = page.getByRole('button', { name: 'remove' })
            await expect(deleteBtn).not.toBeVisible()
        })

        test('verify blogs are arranges in the order based on likes', async ({ page }) => {
            await createBlog(page, 'title_1', mockBlog.author, mockBlog.url)
            await createBlog(page, 'title_2', mockBlog.author, mockBlog.url)

            const blogLocator = page.getByTestId('blog')
            const recentlyAdded = blogLocator.last()
            await recentlyAdded.getByRole('button', { name: 'View' }).click()
            await recentlyAdded.getByRole('button', { name: 'like' }).click()
            const mostLiked = blogLocator.first()
            await expect(mostLiked).toContainText(`title_2 ${mockBlog.author}`)
        })
    })
})