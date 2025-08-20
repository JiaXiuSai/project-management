import { expect, test } from '@playwright/test'

import {
  TEST_PROJECTS,
  createTestProject,
  resetMockData,
  setupMockRoutes,
} from './utils/test-helpers'

test.beforeEach(async ({ page }) => {
  resetMockData()
  await setupMockRoutes(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test.describe('Delete Project', () => {
  test('should open delete confirmation modal', async ({ page }) => {
    const project = TEST_PROJECTS[0]
    await createTestProject(page, project)

    await page.getByRole('button', { name: `Edit project: ${project.name}` }).click()

    const deleteButton = page.getByRole('button', { name: 'Delete' })

    if (await deleteButton.isVisible()) {
      await deleteButton.click()
    }

    await expect(page.getByRole('heading', { name: 'Delete Project' })).toBeVisible()
    await expect(page.locator(`[data-testid="delete-project-modal-button"]`)).toBeVisible()
  })

  test('should delete project when confirmed', async ({ page }) => {
    const project = TEST_PROJECTS[0]
    await createTestProject(page, project)

    await expect(page.getByRole('button', { name: `Edit project: ${project.name}` })).toBeVisible()

    await page.getByRole('button', { name: `Edit project: ${project.name}` }).click()

    const deleteButton = page.locator(`[data-testid="delete-project-${project.name}"]`)
    if (await deleteButton.isVisible()) {
      await deleteButton.click()
    }

    await page.locator(`[data-testid="delete-project-modal-button"]`).click()

    await expect(page.getByRole('dialog', { name: 'Delete Project' })).not.toBeVisible()

    // Check that the deleted project is no longer visible from the test projects list
    await expect(
      page.getByRole('button', { name: `Edit project: ${project.name}` })
    ).not.toBeVisible()
  })
})
