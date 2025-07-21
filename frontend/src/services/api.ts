import { API_BASE_URL } from '../constants'

export interface Project {
  id: number
  name: string
  status: string
  description: string
}

export interface ProjectListItem {
  id: number
  name: string
  status: string
  description: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalProjects: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ProjectsResponse {
  projects: Project[] | ProjectListItem[]
  pagination: PaginationInfo
}

export interface ApiErrorResponse {
  error: string
  message?: string
}

export class ApiError extends Error {
  public status: number
  public response?: ApiErrorResponse

  constructor(message: string, status: number, response?: ApiErrorResponse) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.response = response
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`
    let errorData: ApiErrorResponse = { error: errorMessage }

    try {
      errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // If response is not JSON, use default error message
    }

    throw new ApiError(errorMessage, response.status, errorData)
  }

  return response.json()
}

export const api = {
  async getProjects(
    search = '',
    page = 1,
    limit = 5,
    includeDates = false,
    status = '',
    signal?: AbortSignal
  ): Promise<ProjectsResponse> {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
      includeDates: includeDates.toString(),
    })

    // Add status filter if provided
    if (status) {
      params.append('status', status)
    }

    const response = await fetch(`${API_BASE_URL}/projects?${params}`, {
      signal,
    })
    return handleResponse<ProjectsResponse>(response)
  },

  // Get a specific project
  async getProject(id: number, signal?: AbortSignal): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      signal,
    })
    return handleResponse<Project>(response)
  },

  // Get available statuses
  async getStatuses(signal?: AbortSignal): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/statuses`, {
      signal,
    })
    return handleResponse<string[]>(response)
  },

  // Create a new project
  async createProject(projectData: Omit<Project, 'id'>, signal?: AbortSignal): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
      signal,
    })
    return handleResponse<Project>(response)
  },

  // Update a project
  async updateProject(
    id: number,
    projectData: Partial<Project>,
    signal?: AbortSignal
  ): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
      signal,
    })
    return handleResponse<Project>(response)
  },

  // Update only the status of a project
  async updateProjectStatus(id: number, status: string, signal?: AbortSignal): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
      signal,
    })
    return handleResponse<Project>(response)
  },

  // Delete a project
  async deleteProject(
    id: number,
    signal?: AbortSignal
  ): Promise<{ message: string; deletedProject: Project }> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      signal,
    })
    return handleResponse<{ message: string; deletedProject: Project }>(response)
  },
}
