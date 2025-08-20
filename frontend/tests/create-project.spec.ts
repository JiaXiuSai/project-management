import { expect, test } from '@playwright/test'

import { resetMockData, setupMockRoutes } from './utils/test-helpers'

test.beforeEach(async ({ page }) => {
  resetMockData()
  await setupMockRoutes(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test.describe('Create Project', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Create' }).click()
  })

  test('should open create project modal when create button is clicked', async ({ page }) => {
    await expect(page.getByRole('dialog', { name: 'Create Project' })).toBeVisible()
    await expect(page.getByLabel('Project Name*')).toBeVisible()
    await expect(page.getByLabel('Status*')).toBeVisible()
    await expect(page.getByLabel('Description')).toBeVisible()
  })

  test('should create a new project successfully', async ({ page }) => {
    const newProject = {
      name: 'New Project',
      description: 'This is a new project',
      status: 'In Progress',
    }

    await page.getByLabel('Project Name*').fill(newProject.name)
    await page.getByLabel('Status*').selectOption(newProject.status)
    await page.getByLabel('Description').fill(newProject.description)

    await page.getByTestId('create-project-button').click()

    await expect(page.getByRole('dialog', { name: 'Create Project' })).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: `Edit project: ${newProject.name}` })
    ).toBeVisible()
    await expect(page.getByText(newProject.description)).toBeVisible()
  })

  test('should show validation errors for required fields', async ({ page }) => {
    await page.getByTestId('create-project-button').click()
    await expect(page.getByText('Project name is required')).toBeVisible()
  })

  test('should close create modal when close button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByRole('dialog', { name: 'Create Project' })).not.toBeVisible()
  })
})
