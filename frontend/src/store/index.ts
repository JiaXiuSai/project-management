import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

import { useMemo } from 'react'

import type { Project, ProjectListItem } from '../services/api'

// State interfaces
interface AppState {
  // Projects and pagination
  projects: (Project | ProjectListItem)[]
  totalPages: number
  totalProjects: number
  currentPage: number

  // Loading and error states
  loading: boolean
  error: string | null
  statuses: string[]

  // Search and filtering
  search: string
  statusFilter: string

  // Modal states
  modals: {
    create: boolean
    edit: {
      open: boolean
      project: Project | null
      dirty: boolean
    }
    delete: {
      open: boolean
      id: number | null
      name: string
    }
    unsaved: boolean
  }

  // Action loading states
  actions: {
    creatingProject: boolean
    updatingProject: boolean
    deletingProject: boolean
    updatingStatus: number | null
  }
}

// Actions interface
interface AppActions {
  // Project actions
  setProjects: (
    projects: (Project | ProjectListItem)[],
    totalPages: number,
    totalProjects: number
  ) => void
  setCurrentPage: (page: number) => void
  updateProject: (project: Project) => void
  addProject: (project: Project) => void
  removeProject: (projectId: number) => void

  // Loading and error actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setStatuses: (statuses: string[]) => void

  // Search and filtering actions
  setSearch: (search: string) => void
  setStatusFilter: (status: string) => void
  resetSearch: () => void

  // Modal actions
  openCreateModal: () => void
  closeCreateModal: () => void
  openEditModal: (project: Project) => void
  closeEditModal: () => void
  setEditDirty: (dirty: boolean) => void
  openDeleteModal: (id: number, name: string) => void
  closeDeleteModal: () => void
  openUnsavedModal: () => void
  closeUnsavedModal: () => void
  closeAllModals: () => void

  // Action loading states
  setCreatingProject: (creating: boolean) => void
  setUpdatingProject: (updating: boolean) => void
  setDeletingProject: (deleting: boolean) => void
  setUpdatingStatus: (projectId: number | null) => void

  // Reset store
  reset: () => void
}

type AppStore = AppState & AppActions

const initialState: AppState = {
  projects: [],
  totalPages: 1,
  totalProjects: 0,
  currentPage: 1,
  loading: true,
  error: null,
  statuses: [],
  search: '',
  statusFilter: '',
  modals: {
    create: false,
    edit: {
      open: false,
      project: null,
      dirty: false,
    },
    delete: {
      open: false,
      id: null,
      name: '',
    },
    unsaved: false,
  },
  actions: {
    creatingProject: false,
    updatingProject: false,
    deletingProject: false,
    updatingStatus: null,
  },
}

export const useAppStore = create<AppStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      ...initialState,

      // Project actions
      setProjects: (projects, totalPages, totalProjects) =>
        set((state) => ({
          ...state,
          projects,
          totalPages,
          totalProjects,
        })),

      setCurrentPage: (page) =>
        set((state) => ({
          ...state,
          currentPage: page,
        })),

      updateProject: (project) =>
        set((state) => ({
          ...state,
          projects: state.projects.map((p) => (p.id === project.id ? project : p)),
        })),

      addProject: (project) =>
        set((state) => ({
          ...state,
          projects: [project, ...state.projects],
          totalProjects: state.totalProjects + 1,
        })),

      removeProject: (projectId) =>
        set((state) => ({
          ...state,
          projects: state.projects.filter((p) => p.id !== projectId),
          totalProjects: state.totalProjects - 1,
        })),

      // Loading and error actions
      setLoading: (loading) =>
        set((state) => ({
          ...state,
          loading,
        })),

      setError: (error) =>
        set((state) => ({
          ...state,
          error,
        })),

      setStatuses: (statuses) =>
        set((state) => ({
          ...state,
          statuses,
        })),

      // Search and filtering actions
      setSearch: (search) =>
        set((state) => ({
          ...state,
          search,
        })),

      setStatusFilter: (status) =>
        set((state) => ({
          ...state,
          statusFilter: status,
        })),

      resetSearch: () =>
        set((state) => ({
          ...state,
          search: '',
          currentPage: 1,
        })),

      // Modal actions
      openCreateModal: () =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            create: true,
          },
        })),

      closeCreateModal: () =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            create: false,
          },
        })),

      openEditModal: (project) =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            edit: {
              open: true,
              project,
              dirty: false,
            },
          },
        })),

      closeEditModal: () =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            edit: {
              open: false,
              project: null,
              dirty: false,
            },
          },
        })),

      setEditDirty: (dirty) =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            edit: {
              ...state.modals.edit,
              dirty,
            },
          },
        })),

      openDeleteModal: (id, name) =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            delete: {
              open: true,
              id,
              name,
            },
          },
        })),

      closeDeleteModal: () =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            delete: {
              open: false,
              id: null,
              name: '',
            },
          },
        })),

      openUnsavedModal: () =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            unsaved: true,
          },
        })),

      closeUnsavedModal: () =>
        set((state) => ({
          ...state,
          modals: {
            ...state.modals,
            unsaved: false,
          },
        })),

      closeAllModals: () =>
        set((state) => ({
          ...state,
          modals: {
            create: false,
            edit: { open: false, project: null, dirty: false },
            delete: { open: false, id: null, name: '' },
            unsaved: false,
          },
        })),

      // Action loading states
      setCreatingProject: (creating) =>
        set((state) => ({
          ...state,
          actions: {
            ...state.actions,
            creatingProject: creating,
          },
        })),

      setUpdatingProject: (updating) =>
        set((state) => ({
          ...state,
          actions: {
            ...state.actions,
            updatingProject: updating,
          },
        })),

      setDeletingProject: (deleting) =>
        set((state) => ({
          ...state,
          actions: {
            ...state.actions,
            deletingProject: deleting,
          },
        })),

      setUpdatingStatus: (projectId) =>
        set((state) => ({
          ...state,
          actions: {
            ...state.actions,
            updatingStatus: projectId,
          },
        })),

      // Reset store
      reset: () => set(() => ({ ...initialState })),
    })),
    {
      name: 'app-store',
    }
  )
)

// Selector hooks for better performance
export const useProjects = () => useAppStore((state) => state.projects)
export const useStatuses = () => useAppStore((state) => state.statuses)
export const useModalState = () => useAppStore((state) => state.modals)
export const useActionState = () => useAppStore((state) => state.actions)

// Individual state selectors
export const useTotalPages = () => useAppStore((state) => state.totalPages)
export const useTotalProjects = () => useAppStore((state) => state.totalProjects)
export const useCurrentPage = () => useAppStore((state) => state.currentPage)
export const useLoading = () => useAppStore((state) => state.loading)
export const useError = () => useAppStore((state) => state.error)
export const useSearchValue = () => useAppStore((state) => state.search)
export const useStatusFilter = () => useAppStore((state) => state.statusFilter)

// Action selectors
export const useSetProjects = () => useAppStore((state) => state.setProjects)
export const useSetCurrentPage = () => useAppStore((state) => state.setCurrentPage)
export const useUpdateProject = () => useAppStore((state) => state.updateProject)
export const useAddProject = () => useAppStore((state) => state.addProject)
export const useRemoveProject = () => useAppStore((state) => state.removeProject)
export const useSetLoading = () => useAppStore((state) => state.setLoading)
export const useSetError = () => useAppStore((state) => state.setError)
export const useSetStatuses = () => useAppStore((state) => state.setStatuses)
export const useSetSearch = () => useAppStore((state) => state.setSearch)
export const useSetStatusFilter = () => useAppStore((state) => state.setStatusFilter)
export const useResetSearch = () => useAppStore((state) => state.resetSearch)

// Modal actions
export const useOpenCreateModal = () => useAppStore((state) => state.openCreateModal)
export const useCloseCreateModal = () => useAppStore((state) => state.closeCreateModal)
export const useOpenEditModal = () => useAppStore((state) => state.openEditModal)
export const useCloseEditModal = () => useAppStore((state) => state.closeEditModal)
export const useSetEditDirty = () => useAppStore((state) => state.setEditDirty)
export const useOpenDeleteModal = () => useAppStore((state) => state.openDeleteModal)
export const useCloseDeleteModal = () => useAppStore((state) => state.closeDeleteModal)
export const useOpenUnsavedModal = () => useAppStore((state) => state.openUnsavedModal)
export const useCloseUnsavedModal = () => useAppStore((state) => state.closeUnsavedModal)
export const useCloseAllModals = () => useAppStore((state) => state.closeAllModals)

// Action loading states
export const useSetCreatingProject = () => useAppStore((state) => state.setCreatingProject)
export const useSetUpdatingProject = () => useAppStore((state) => state.setUpdatingProject)
export const useSetDeletingProject = () => useAppStore((state) => state.setDeletingProject)
export const useSetUpdatingStatus = () => useAppStore((state) => state.setUpdatingStatus)

// Memoized grouped selectors to prevent infinite re-renders
export const usePagination = () => {
  const totalPages = useTotalPages()
  const totalProjects = useTotalProjects()
  const currentPage = useCurrentPage()
  return useMemo(
    () => ({ totalPages, totalProjects, currentPage }),
    [totalPages, totalProjects, currentPage]
  )
}

export const useLoadingState = () => {
  const loading = useLoading()
  const error = useError()
  return useMemo(() => ({ loading, error }), [loading, error])
}

export const useSearchState = () => {
  const search = useSearchValue()
  const statusFilter = useStatusFilter()
  return useMemo(() => ({ search, statusFilter }), [search, statusFilter])
}

export const useProjectActions = () => {
  const setProjects = useSetProjects()
  const setCurrentPage = useSetCurrentPage()
  const updateProject = useUpdateProject()
  const addProject = useAddProject()
  const removeProject = useRemoveProject()
  return useMemo(
    () => ({ setProjects, setCurrentPage, updateProject, addProject, removeProject }),
    [setProjects, setCurrentPage, updateProject, addProject, removeProject]
  )
}

export const useLoadingActions = () => {
  const setLoading = useSetLoading()
  const setError = useSetError()
  const setStatuses = useSetStatuses()
  return useMemo(() => ({ setLoading, setError, setStatuses }), [setLoading, setError, setStatuses])
}

export const useSearchActions = () => {
  const setSearch = useSetSearch()
  const setStatusFilter = useSetStatusFilter()
  const resetSearch = useResetSearch()
  return useMemo(
    () => ({ setSearch, setStatusFilter, resetSearch }),
    [setSearch, setStatusFilter, resetSearch]
  )
}

export const useModalActions = () => {
  const openCreateModal = useOpenCreateModal()
  const closeCreateModal = useCloseCreateModal()
  const openEditModal = useOpenEditModal()
  const closeEditModal = useCloseEditModal()
  const setEditDirty = useSetEditDirty()
  const openDeleteModal = useOpenDeleteModal()
  const closeDeleteModal = useCloseDeleteModal()
  const openUnsavedModal = useOpenUnsavedModal()
  const closeUnsavedModal = useCloseUnsavedModal()
  const closeAllModals = useCloseAllModals()
  return useMemo(
    () => ({
      openCreateModal,
      closeCreateModal,
      openEditModal,
      closeEditModal,
      setEditDirty,
      openDeleteModal,
      closeDeleteModal,
      openUnsavedModal,
      closeUnsavedModal,
      closeAllModals,
    }),
    [
      openCreateModal,
      closeCreateModal,
      openEditModal,
      closeEditModal,
      setEditDirty,
      openDeleteModal,
      closeDeleteModal,
      openUnsavedModal,
      closeUnsavedModal,
      closeAllModals,
    ]
  )
}

export const useActionStateActions = () => {
  const setCreatingProject = useSetCreatingProject()
  const setUpdatingProject = useSetUpdatingProject()
  const setDeletingProject = useSetDeletingProject()
  const setUpdatingStatus = useSetUpdatingStatus()
  return useMemo(
    () => ({ setCreatingProject, setUpdatingProject, setDeletingProject, setUpdatingStatus }),
    [setCreatingProject, setUpdatingProject, setDeletingProject, setUpdatingStatus]
  )
}
