import { expect, test } from '@playwright/test'

import { resetMockData, setupMockRoutes } from './utils/test-helpers'

test.beforeEach(async ({ page }) => {
  resetMockData()
  await setupMockRoutes(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test.describe('Keyboard Shortcuts', () => {
  test('should close modals when Escape is pressed', async ({ page }) => {
    await page.getByRole('button', { name: 'Create' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Create Project' })).not.toBeVisible()
  })

  test('should focus search input when Ctrl+F is pressed', async ({ page }) => {
    await page.keyboard.press('Control+f')
    const searchInput = page.getByPlaceholder('Search')
    await expect(searchInput).toBeFocused()
  })
})

test.describe('Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
  })

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
  })
})
