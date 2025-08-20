import { expect, test } from '@playwright/test'

import { resetMockData, setupMockRoutes } from './utils/test-helpers'

test.beforeEach(async ({ page }) => {
  resetMockData()
  await setupMockRoutes(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test.describe('Project List Display', () => {
  test('should display the project list page', async ({ page }) => {
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.getByPlaceholder('Search')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
  })

  test('should display project cards when projects exist', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Edit project: Test Project Alpha' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Edit project: Test Project Beta' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Edit project: Test Project Gamma' })
    ).toBeVisible()
  })

  test('should display correct project information', async ({ page }) => {
    await expect(page.getByText('This is a test project for automated testing')).toBeVisible()
    await expect(page.getByText('Another test project for comprehensive testing')).toBeVisible()
    await expect(page.getByText('Third test project to verify all functionality')).toBeVisible()
  })
})
