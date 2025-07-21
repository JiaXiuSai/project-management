import { useCallback, useRef } from 'react'

import { ApiError, type Project, api } from '../services/api'
import type { ProjectFormData } from '../utils/validation'

interface UseProjectApiProps {
  onError: (message: string) => void
  onSuccess?: (type: 'success' | 'error', message: string) => void
}

export const useProjectApi = ({ onError, onSuccess }: UseProjectApiProps) => {
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess

  const handleApiError = useCallback(
    (error: unknown, defaultMessage: string) => {
      let errorMessage = defaultMessage
      if (error instanceof ApiError) {
        errorMessage = error.message
        if (error.status === 409) {
          onSuccessRef.current?.('error', errorMessage)
          return
        }
      }
      onError(errorMessage)
    },
    [onError]
  )

  const createProject = useCallback(
    async (formData: ProjectFormData): Promise<Project> => {
      try {
        const newProject = await api.createProject({
          name: formData.name,
          status: formData.status,
          description: formData.description || '',
        })

        onSuccess?.('success', `Project "${newProject.name}" created successfully!`)
        return newProject
      } catch (error) {
        handleApiError(error, 'Failed to create project. Please try again.')
        throw error
      }
    },
    [handleApiError, onSuccess]
  )

  const updateProject = useCallback(
    async (id: number, formData: ProjectFormData): Promise<Project> => {
      try {
        const updatedProject = await api.updateProject(id, {
          name: formData.name,
          status: formData.status,
          description: formData.description,
        })

        onSuccess?.('success', `Project "${updatedProject.name}" updated successfully!`)
        return updatedProject
      } catch (error) {
        handleApiError(error, 'Failed to update project. Please try again.')
        throw error
      }
    },
    [handleApiError, onSuccess]
  )

  const deleteProject = useCallback(
    async (id: number): Promise<{ message: string; deletedProject: Project }> => {
      try {
        const result = await api.deleteProject(id)
        onSuccess?.('success', `Project "${result.deletedProject.name}" deleted successfully!`)
        return result
      } catch (error) {
        handleApiError(error, 'Failed to delete project. Please try again.')
        throw error
      }
    },
    [handleApiError, onSuccess]
  )

  const updateProjectStatus = useCallback(
    async (id: number, status: string): Promise<Project> => {
      try {
        const updatedProject = await api.updateProjectStatus(id, status)
        return updatedProject
      } catch (error) {
        handleApiError(error, 'Failed to update status. Please try again.')
        throw error
      }
    },
    [handleApiError]
  )

  const getProject = useCallback(
    async (id: number): Promise<Project> => {
      try {
        return await api.getProject(id)
      } catch (error) {
        handleApiError(error, 'Failed to load project details. Please try again.')
        throw error
      }
    },
    [handleApiError]
  )

  const getProjects = useCallback(
    async (
      search: string,
      page: number,
      limit: number,
      includeDates: boolean,
      status: string,
      signal?: AbortSignal
    ) => {
      try {
        return await api.getProjects(search, page, limit, includeDates, status, signal)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw error // Re-throw abort errors to be handled by caller
        }
        handleApiError(error, 'Failed to load projects. Please try again.')
        throw error
      }
    },
    [handleApiError]
  )

  const getStatuses = useCallback(async (): Promise<string[]> => {
    try {
      return await api.getStatuses()
    } catch {
      return []
    }
  }, [])

  return {
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    getProject,
    getProjects,
    getStatuses,
  }
}
