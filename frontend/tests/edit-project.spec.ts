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

test.describe('Edit Project', () => {
  test('should open edit modal when project name is clicked', async ({ page }) => {
    const project = TEST_PROJECTS[0]
    await createTestProject(page, project)

    await page.getByRole('button', { name: `Edit project: ${project.name}` }).click()

    await expect(page.getByRole('dialog', { name: 'Edit Project' })).toBeVisible()
    await expect(page.getByLabel('Project Name*')).toHaveValue(project.name)
    await expect(page.getByLabel('Status*')).toHaveValue(project.status)
    await expect(page.getByLabel('Description')).toHaveValue(project.description)
  })

  test('should update project successfully', async ({ page }) => {
    const originalProject = TEST_PROJECTS[0]
    const updatedProject = {
      name: 'Updated Project Name',
      description: 'Updated project description',
      status: 'Completed',
    }

    await createTestProject(page, originalProject)
    await page.getByRole('button', { name: `Edit project: ${originalProject.name}` }).click()

    await page.getByLabel('Project Name*').fill(updatedProject.name)
    await page.getByLabel('Description').fill(updatedProject.description)
    await page.getByLabel('Status*').selectOption(updatedProject.status)

    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByRole('dialog', { name: 'Edit Project' })).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: `Edit project: ${updatedProject.name}` })
    ).toBeVisible()
    await expect(page.getByText(updatedProject.description)).toBeVisible()
  })

  test('should close edit modal when cancel button is clicked', async ({ page }) => {
    const project = TEST_PROJECTS[0]
    await createTestProject(page, project)
    await page.getByRole('button', { name: `Edit project: ${project.name}` }).click()

    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByRole('dialog', { name: 'Edit Project' })).not.toBeVisible()
  })
})
