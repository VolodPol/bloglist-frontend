import { expect, test } from  '@playwright/test'


const mockUser = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
}


test.describe('Blog app', () => {
    test.beforeEach(async ({ page, request }) => {
        await request.post('/testing/reset')
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
            await page.getByLabel('username').fill(mockUser.username)
            await page.getByLabel('password').fill(mockUser.password)
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText(`${mockUser.name} logged in`)).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByLabel('username').fill(mockUser.username)
            await page.getByLabel('password').fill('wrong')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('wrong credentials')).toBeVisible()

            await expect(page.getByText(`${mockUser.name} logged in`)).not.toBeVisible()
        })
    })
})