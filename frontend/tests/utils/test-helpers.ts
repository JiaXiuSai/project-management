import { type Page, expect } from '@playwright/test'

export const TEST_PROJECTS = [
  {
    id: 1,
    name: 'Test Project Alpha',
    description: 'This is a test project for automated testing',
    status: 'In Progress',
  },
  {
    id: 2,
    name: 'Test Project Beta',
    description: 'Another test project for comprehensive testing',
    status: 'Planning',
  },
  {
    id: 3,
    name: 'Test Project Gamma',
    description: 'Third test project to verify all functionality',
    status: 'Completed',
  },
] as const

export type TestProject = (typeof TEST_PROJECTS)[number]

// Mutable copy of projects for testing
let mockProjects = [...TEST_PROJECTS]

export async function setupMockRoutes(page: Page) {
  // Mock GET /api/projects - returns test projects with pagination
  await page.route('**/api/projects**', async (route) => {
    const url = new URL(route.request().url())
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    let filteredProjects = [...mockProjects]

    // Apply search filter
    if (search) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(search.toLowerCase()) ||
          project.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply status filter
    if (status && status.trim() !== '') {
      filteredProjects = filteredProjects.filter((project) => project.status === status)
    }

    // Apply pagination
    const totalProjects = filteredProjects.length
    const totalPages = Math.ceil(totalProjects / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        projects: paginatedProjects,
        pagination: {
          currentPage: page,
          totalPages,
          totalProjects,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }),
    })
  })

  // Mock POST /api/projects - creates new project
  await page.route('**/api/projects', async (route) => {
    if (route.request().method() === 'POST') {
      const postData = await route.request().postDataJSON()
      const projectData = {
        id: Date.now(),
        ...postData,
      }

      // Add the new project to our mock data
      mockProjects.push(projectData)

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(projectData),
      })
    }
  })

  // Mock PUT /api/projects/:id - updates project
  await page.route('**/api/projects/*', async (route) => {
    const url = route.request().url()
    const projectId = url.split('/').pop()

    if (route.request().method() === 'PUT') {
      const putData = await route.request().postDataJSON()
      const updatedProject = {
        id: parseInt(projectId!),
        ...putData,
      }

      // Update the project in our mock data
      const index = mockProjects.findIndex((p) => p.id === parseInt(projectId!))
      if (index !== -1) {
        mockProjects[index] = updatedProject
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(updatedProject),
      })
    }

    // Mock DELETE /api/projects/:id - deletes project
    if (route.request().method() === 'DELETE') {
      const projectIdNum = parseInt(projectId!)
      const deletedProject = mockProjects.find((p) => p.id === projectIdNum)

      // Remove the project from our mock data
      mockProjects = mockProjects.filter((p) => p.id !== projectIdNum)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Project deleted successfully',
          deletedProject: deletedProject || null,
        }),
      })
    }
  })

  // Mock PATCH /api/projects/:id/status - updates project status
  await page.route('**/api/projects/*/status', async (route) => {
    if (route.request().method() === 'PATCH') {
      const url = route.request().url()
      const projectId = url.split('/').slice(-2)[0] // Get ID from /api/projects/:id/status
      const patchData = await route.request().postDataJSON()

      // Update the project status in our mock data
      const index = mockProjects.findIndex((p) => p.id === parseInt(projectId))
      if (index !== -1) {
        mockProjects[index] = {
          ...mockProjects[index],
          status: patchData.status,
        }
      }

      const updatedProject = {
        id: parseInt(projectId),
        ...mockProjects.find((p) => p.id === parseInt(projectId)),
        status: patchData.status,
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(updatedProject),
      })
    }
  })

  // Mock GET /api/statuses - returns available statuses
  await page.route('**/api/statuses', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        'Backlog',
        'Planning',
        'In Progress',
        'On Hold',
        'Under Review',
        'Completed',
        'Cancelled',
      ]),
    })
  })
}

export async function createTestProject(page: Page, project: TestProject) {
  // Check if project already exists
  const existingProject = page.getByRole('button', { name: `Edit project: ${project.name}` })
  if (await existingProject.isVisible()) {
    return
  }

  // Open create modal
  await page.getByRole('button', { name: 'Create' }).click()

  // Fill in the form
  await page.getByLabel('Project Name*').fill(project.name)
  await page.getByLabel('Status*').selectOption(project.status)
  await page.getByLabel('Description').fill(project.description)

  // Submit the form
  await page.getByTestId('create-project-button').click()

  // Wait for the modal to close and project to appear
  await expect(page.getByRole('button', { name: `Edit project: ${project.name}` })).toBeVisible()
}

// Function to reset mock data between tests
export function resetMockData() {
  mockProjects = [...TEST_PROJECTS]
}
