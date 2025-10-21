import { expect, test } from  '@playwright/test'


test.describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
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
})