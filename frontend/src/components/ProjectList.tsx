import { useCallback, useEffect, useRef } from 'react'

import { DEFAULT_STATUSES, PAGE_SIZE } from '../constants'
import { useKeyboardShortcuts, useProjectApi, useSearch, useToast } from '../hooks'
import type { Project, ProjectListItem } from '../services/api'
import {
  useActionState,
  useActionStateActions,
  useLoadingActions,
  useLoadingState,
  useModalActions,
  useModalState,
  usePagination,
  useProjectActions,
  useProjects,
  useSearchActions,
  useSearchState,
  useStatuses,
} from '../store'
import type { ProjectFormData } from '../utils/validation'
import { ProjectModals } from './modals'
import { ProjectListContent, ProjectListErrorBoundary, ProjectListHeader } from './project'
import { SearchSection } from './search'
import { ErrorMessage, ScreenReaderAnnouncements, Toast } from './shared'

const ProjectList = () => {
  // Zustand store selectors
  const projects = useProjects()
  const { totalPages, totalProjects, currentPage } = usePagination()
  const { loading, error } = useLoadingState()
  const { search, statusFilter } = useSearchState()
  const modals = useModalState()
  const actions = useActionState()
  const statuses = useStatuses()

  // Zustand store actions
  const { setProjects, setCurrentPage, updateProject: updateProjectInStore } = useProjectActions()
  const { setLoading, setError, setStatuses } = useLoadingActions()
  const { setSearch, setStatusFilter } = useSearchActions()
  const {
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  } = useModalActions()
  const { setCreatingProject, setUpdatingProject, setDeletingProject, setUpdatingStatus } =
    useActionStateActions()

  const abortControllerRef = useRef<AbortController | null>(null)
  const isInitialLoadRef = useRef(true)

  const { toast, showToast, hideToast } = useToast()

  // Create a custom error handler that sets both error and loading state
  const handleApiError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage)
      setLoading(false)
    },
    [setError, setLoading]
  )

  const {
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    getProjects,
    getStatuses,
  } = useProjectApi({
    onError: handleApiError,
    onSuccess: (type, message) => showToast(type, message),
  })

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setSearch(newSearch)
      setCurrentPage(1)
    },
    [setSearch, setCurrentPage]
  )

  const { searchInput, handleSearchInputChange, clearSearch } = useSearch({
    onSearchChange: handleSearchChange,
  })

  useKeyboardShortcuts({
    onFocusSearch: () => {
      const searchInput = document.querySelector(
        'input[aria-label="Search projects"]'
      ) as HTMLInputElement
      if (searchInput) searchInput.focus()
    },
    onCloseModals: () => {
      if (modals.create) closeCreateModal()
      if (modals.edit.open) closeEditModal()
      if (modals.delete.open) closeDeleteModal()
    },
    disabled: loading,
  })

  const cleanupAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      cleanupAbortController()
    }
  }, [cleanupAbortController])

  const loadStatuses = async () => {
    try {
      const statusesData = await getStatuses()
      setStatuses(statusesData.length > 0 ? statusesData : DEFAULT_STATUSES)
    } catch {
      setStatuses(DEFAULT_STATUSES)
    }
  }

  const loadProjects = useCallback(async () => {
    try {
      cleanupAbortController()
      abortControllerRef.current = new AbortController()

      setLoading(true)
      setError(null)

      const response = await getProjects(
        search,
        currentPage,
        PAGE_SIZE,
        false,
        statusFilter,
        abortControllerRef.current.signal
      )

      setProjects(
        response.projects,
        response.pagination.totalPages,
        response.pagination.totalProjects
      )
      // Only set loading to false on successful completion
      setLoading(false)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      // Error will be handled by useProjectApi's onError callback (handleApiError)
      // which will set both error and loading state
    }
  }, [
    search,
    statusFilter,
    currentPage,
    cleanupAbortController,
    getProjects,
    setProjects,
    setLoading,
    setError,
  ])

  useEffect(() => {
    const initialLoad = async () => {
      await loadStatuses()
      await loadProjects()
      isInitialLoadRef.current = false
    }
    initialLoad()
  }, [])

  useEffect(() => {
    if (!isInitialLoadRef.current) {
      loadProjects()
    }
  }, [search, statusFilter, currentPage, loadProjects])

  const handleEdit = useCallback(
    async (project: ProjectListItem | Project) => {
      try {
        openEditModal({ ...project })
      } catch {
        showToast('error', 'Error setting edit modal')
      }
    },
    [openEditModal]
  )

  const handleEditSave = useCallback(
    async (formData: ProjectFormData) => {
      if (!modals.edit.project) return

      try {
        setUpdatingProject(true)
        const updatedProject = await updateProject(modals.edit.project.id, formData)

        updateProjectInStore(updatedProject)
        closeEditModal()
      } catch {
        showToast('error', 'Error updating project')
      } finally {
        setUpdatingProject(false)
      }
    },
    [modals.edit.project, updateProject, updateProjectInStore, setUpdatingProject, closeEditModal]
  )

  const handleEditClose = () => {
    closeEditModal()
  }

  const handleStatusChange = useCallback(
    async (id: number, status: string) => {
      try {
        setUpdatingStatus(id)
        const updatedProject = await updateProjectStatus(id, status)

        updateProjectInStore(updatedProject)
      } catch {
        showToast('error', 'Error updating project status')
      } finally {
        setUpdatingStatus(null)
      }
    },
    [updateProjectStatus, updateProjectInStore, setUpdatingStatus]
  )

  const handleCreate = useCallback(
    async (formData: ProjectFormData) => {
      try {
        setCreatingProject(true)
        await createProject(formData)
        closeCreateModal()
        await loadProjects()
      } catch {
        showToast('error', 'Error creating project')
      } finally {
        setCreatingProject(false)
      }
    },
    [createProject, loadProjects, setCreatingProject, closeCreateModal]
  )

  const handleDelete = useCallback(async () => {
    if (!modals.delete.id) return

    try {
      setDeletingProject(true)
      await deleteProject(modals.delete.id)

      // Close all modals
      closeCreateModal()
      closeEditModal()
      closeDeleteModal()

      await loadProjects()
    } catch {
      showToast('error', 'Error deleting project')
    } finally {
      setDeletingProject(false)
    }
  }, [
    modals.delete.id,
    deleteProject,
    loadProjects,
    setDeletingProject,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
  ])

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage)
    },
    [setCurrentPage]
  )

  const handleStatusFilterChange = useCallback(
    (status: string) => {
      setStatusFilter(status)
      setCurrentPage(1)
    },
    [setStatusFilter, setCurrentPage]
  )

  const handleRetry = useCallback(() => {
    setError(null)
    loadProjects()
  }, [setError, loadProjects])

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-4 text-gray-900 shadow md:p-6">
      <ScreenReaderAnnouncements
        loading={loading}
        error={error}
        projectsCount={projects.length}
        totalProjects={totalProjects}
      />

      <ProjectListHeader onCreateClick={openCreateModal} disabled={loading} />

      {error && <ErrorMessage message={error} onRetry={handleRetry} className="mb-4" />}

      <SearchSection
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
        onClearSearch={clearSearch}
        search={search}
        totalResults={totalProjects}
        loading={loading}
        statusFilter={statusFilter}
        statuses={statuses}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <ProjectListErrorBoundary onRetry={handleRetry}>
        <ProjectListContent
          projects={projects}
          loading={loading}
          search={search}
          statuses={statuses}
          currentPage={currentPage}
          totalPages={totalPages}
          updatingStatus={actions.updatingStatus}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      </ProjectListErrorBoundary>

      <ProjectModals
        createModalOpen={modals.create}
        onCreateClose={closeCreateModal}
        onCreateSubmit={handleCreate}
        creatingProject={actions.creatingProject}
        editModalOpen={modals.edit.open}
        editProject={modals.edit.project}
        onEditClose={handleEditClose}
        onEditSubmit={handleEditSave}
        onEditDelete={() => {
          if (modals.edit.project) {
            openDeleteModal(modals.edit.project.id, modals.edit.project.name)
          }
        }}
        updatingProject={actions.updatingProject}
        deleteModalOpen={modals.delete.open}
        deleteProjectName={modals.delete.name}
        onDeleteClose={closeDeleteModal}
        onDeleteConfirm={handleDelete}
        deletingProject={actions.deletingProject}
        statuses={statuses}
      />

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}

export default ProjectList
