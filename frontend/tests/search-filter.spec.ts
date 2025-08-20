import { expect, test } from '@playwright/test'

import { TEST_PROJECTS, resetMockData, setupMockRoutes } from './utils/test-helpers'

test.beforeEach(async ({ page }) => {
  resetMockData()
  await setupMockRoutes(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test.describe('Search and Filter', () => {
  test('should filter projects by status', async ({ page }) => {
    await page.getByLabel('Filter projects by status').selectOption('In Progress')

    // Wait for the filter to be applied and UI to update
    await page.waitForLoadState('networkidle')

    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[0].name}` })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[1].name}` })
    ).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[2].name}` })
    ).not.toBeVisible()
  })

  test('should search projects by name', async ({ page }) => {
    await page.getByPlaceholder('Search').fill('Alpha')

    // Wait for the search to be applied and UI to update
    await page.waitForLoadState('networkidle')

    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[0].name}` })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[1].name}` })
    ).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[2].name}` })
    ).not.toBeVisible()
  })

  test('should clear search when clear button is clicked', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search')
    await searchInput.fill('Alpha')

    // Wait for search to be applied
    await page.waitForLoadState('networkidle')

    const clearButton = page.getByRole('button', { name: 'Clear' })
    if (await clearButton.isVisible()) {
      // Use force click to handle the case where button might be detached during click
      await clearButton.click({ force: true })

      // Wait for the clear operation to complete and UI to update
      await page.waitForLoadState('networkidle')
    }

    await expect(searchInput).toHaveValue('')
    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[0].name}` })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[1].name}` })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: `Edit project: ${TEST_PROJECTS[2].name}` })
    ).toBeVisible()
  })
})
