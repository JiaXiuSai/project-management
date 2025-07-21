import { useCallback, useEffect, useRef, useState } from 'react'

import { DEFAULT_STATUSES, PAGE_SIZE } from '../constants'
import { useKeyboardShortcuts, useProjectApi, useSearch, useToast } from '../hooks'
import type { Project, ProjectListItem } from '../services/api'
import type { ProjectFormData } from '../utils/validation'
import { ProjectModals } from './modals'
import { ProjectListContent, ProjectListErrorBoundary, ProjectListHeader } from './project'
import { SearchSection } from './search'
import { ErrorMessage, ScreenReaderAnnouncements, Toast } from './shared'

const ProjectList = () => {
  // State for projects and pagination
  const [projects, setProjects] = useState<(Project | ProjectListItem)[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalProjects, setTotalProjects] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<string[]>([])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [editModal, setEditModal] = useState<{
    open: boolean
    project: Project | null
  }>({ open: false, project: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean
    id: number | null
    name: string
  }>({ open: false, id: null, name: '' })

  const [creatingProject, setCreatingProject] = useState(false)
  const [updatingProject, setUpdatingProject] = useState(false)
  const [deletingProject, setDeletingProject] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const isInitialLoadRef = useRef(true)

  const { toast, showToast, hideToast } = useToast()
  const {
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    getProjects,
    getStatuses,
  } = useProjectApi({
    onError: setError,
    onSuccess: (type, message) => showToast(type, message),
  })

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch)
    setCurrentPage(1)
  }, [])

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
      if (modalOpen) setModalOpen(false)
      if (editModal.open) handleEditClose()
      if (deleteModal.open) setDeleteModal({ open: false, id: null, name: '' })
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

      setProjects(response.projects)
      setTotalPages(response.pagination.totalPages)
      setTotalProjects(response.pagination.totalProjects)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, currentPage, cleanupAbortController, getProjects])

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

  const handleEdit = useCallback(async (project: ProjectListItem | Project) => {
    try {
      setEditModal({ open: true, project: { ...project } })
    } catch {
      showToast('error', 'Error setting edit modal')
    }
  }, [])

  const handleEditSave = useCallback(
    async (formData: ProjectFormData) => {
      if (!editModal.project) return

      try {
        setUpdatingProject(true)
        const updatedProject = await updateProject(editModal.project.id, formData)

        setProjects((prev) =>
          prev.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj))
        )

        setEditModal({ open: false, project: null })
      } catch {
        showToast('error', 'Error updating project')
      } finally {
        setUpdatingProject(false)
      }
    },
    [editModal.project, updateProject]
  )

  const handleEditClose = () => {
    setEditModal({ open: false, project: null })
  }

  const handleStatusChange = useCallback(
    async (id: number, status: string) => {
      try {
        setUpdatingStatus(id)
        const updatedProject = await updateProjectStatus(id, status)

        setProjects((prev) =>
          prev.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj))
        )
      } catch {
        showToast('error', 'Error updating project status')
      } finally {
        setUpdatingStatus(null)
      }
    },
    [updateProjectStatus]
  )

  const handleCreate = useCallback(
    async (formData: ProjectFormData) => {
      try {
        setCreatingProject(true)
        await createProject(formData)
        setModalOpen(false)
        await loadProjects()
      } catch {
        showToast('error', 'Error creating project')
      } finally {
        setCreatingProject(false)
      }
    },
    [createProject, loadProjects]
  )

  const handleDelete = useCallback(async () => {
    if (!deleteModal.id) return

    try {
      setDeletingProject(true)
      await deleteProject(deleteModal.id)

      // Close all modals
      setModalOpen(false)
      setEditModal({ open: false, project: null })
      setDeleteModal({ open: false, id: null, name: '' })

      await loadProjects()
    } catch {
      showToast('error', 'Error deleting project')
    } finally {
      setDeletingProject(false)
    }
  }, [deleteModal.id, deleteProject, loadProjects])

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage)
  }, [])

  const handleStatusFilterChange = useCallback((status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    loadProjects()
  }, [loadProjects])

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-4 text-gray-900 shadow md:p-6">
      <ScreenReaderAnnouncements
        loading={loading}
        error={error}
        projectsCount={projects.length}
        totalProjects={totalProjects}
      />

      <ProjectListHeader onCreateClick={() => setModalOpen(true)} disabled={loading} />

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
          updatingStatus={updatingStatus}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      </ProjectListErrorBoundary>

      <ProjectModals
        createModalOpen={modalOpen}
        onCreateClose={() => setModalOpen(false)}
        onCreateSubmit={handleCreate}
        creatingProject={creatingProject}
        editModalOpen={editModal.open}
        editProject={editModal.project}
        onEditClose={handleEditClose}
        onEditSubmit={handleEditSave}
        onEditDelete={() => {
          if (editModal.project) {
            setDeleteModal({
              open: true,
              id: editModal.project.id,
              name: editModal.project.name,
            })
          }
        }}
        updatingProject={updatingProject}
        deleteModalOpen={deleteModal.open}
        deleteProjectName={deleteModal.name}
        onDeleteClose={() => setDeleteModal({ open: false, id: null, name: '' })}
        onDeleteConfirm={handleDelete}
        deletingProject={deletingProject}
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
