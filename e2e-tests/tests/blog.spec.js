import { expect, test } from  '@playwright/test'
import { createBlog, login } from './utils/helper'


const mockUser = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
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
            await createBlog(page, 'title', 'author', 'https://url')

            await expect(page.getByText('title author')).toBeVisible()
            await expect(page.getByRole('button', { name: 'View' })).toBeVisible()
        })

        test('like button verification', async ({ page }) => {
            await createBlog(page, 'title', 'author', 'https://url')
            await page.getByRole('button', { name: 'View' }).click()

            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByTestId('likes')).toContainText('1')
        })

        test('user can delete own blogs', async ({ page }) => {
            await createBlog(page, 'title', 'author', 'https://url')
            await page.getByRole('button', { name: 'View' }).click()

            const deleteBtn = page.getByRole('button', { name: 'remove' })
            await expect(deleteBtn).toBeVisible()
            await expect(deleteBtn).toBeEnabled()

            page.on('dialog', dialog => dialog.accept())
            await deleteBtn.click()

            await expect(page.getByText('title author')).not.toBeVisible()
        })
    })
})