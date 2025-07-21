import { useCallback, useReducer } from 'react'

import type { Project, ProjectListItem } from '../services/api'

// State interface
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

// Action types
type AppAction =
  // Projects and pagination
  | {
      type: 'SET_PROJECTS'
      payload: {
        projects: (Project | ProjectListItem)[]
        totalPages: number
        totalProjects: number
      }
    }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: number }

  // Loading and error states
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STATUSES'; payload: string[] }

  // Search and filtering
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: string }
  | { type: 'RESET_SEARCH' }

  // Modal actions
  | { type: 'OPEN_CREATE_MODAL' }
  | { type: 'CLOSE_CREATE_MODAL' }
  | { type: 'OPEN_EDIT_MODAL'; payload: Project }
  | { type: 'CLOSE_EDIT_MODAL' }
  | { type: 'SET_EDIT_DIRTY'; payload: boolean }
  | { type: 'OPEN_DELETE_MODAL'; payload: { id: number; name: string } }
  | { type: 'CLOSE_DELETE_MODAL' }
  | { type: 'OPEN_UNSAVED_MODAL' }
  | { type: 'CLOSE_UNSAVED_MODAL' }
  | { type: 'CLOSE_ALL_MODALS' }

  // Action loading states
  | { type: 'SET_CREATING_PROJECT'; payload: boolean }
  | { type: 'SET_UPDATING_PROJECT'; payload: boolean }
  | { type: 'SET_DELETING_PROJECT'; payload: boolean }
  | { type: 'SET_UPDATING_STATUS'; payload: number | null }

// Initial state
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

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Projects and pagination
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload.projects,
        totalPages: action.payload.totalPages,
        totalProjects: action.payload.totalProjects,
      }

    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      }

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        totalProjects: state.totalProjects + 1,
      }

    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload),
        totalProjects: state.totalProjects - 1,
      }

    // Loading and error states
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'SET_STATUSES':
      return { ...state, statuses: action.payload }

    // Search and filtering
    case 'SET_SEARCH':
      return { ...state, search: action.payload }

    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload }

    case 'RESET_SEARCH':
      return {
        ...state,
        search: '',
        currentPage: 1,
      }

    // Modal actions
    case 'OPEN_CREATE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, create: true },
      }

    case 'CLOSE_CREATE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, create: false },
      }

    case 'OPEN_EDIT_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          edit: {
            open: true,
            project: action.payload,
            dirty: false,
          },
        },
      }

    case 'CLOSE_EDIT_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          edit: {
            open: false,
            project: null,
            dirty: false,
          },
        },
      }

    case 'SET_EDIT_DIRTY':
      return {
        ...state,
        modals: {
          ...state.modals,
          edit: {
            ...state.modals.edit,
            dirty: action.payload,
          },
        },
      }

    case 'OPEN_DELETE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          delete: {
            open: true,
            id: action.payload.id,
            name: action.payload.name,
          },
        },
      }

    case 'CLOSE_DELETE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          delete: {
            open: false,
            id: null,
            name: '',
          },
        },
      }

    case 'OPEN_UNSAVED_MODAL':
      return {
        ...state,
        modals: { ...state.modals, unsaved: true },
      }

    case 'CLOSE_UNSAVED_MODAL':
      return {
        ...state,
        modals: { ...state.modals, unsaved: false },
      }

    case 'CLOSE_ALL_MODALS':
      return {
        ...state,
        modals: {
          create: false,
          edit: { open: false, project: null, dirty: false },
          delete: { open: false, id: null, name: '' },
          unsaved: false,
        },
      }

    // Action loading states
    case 'SET_CREATING_PROJECT':
      return {
        ...state,
        actions: { ...state.actions, creatingProject: action.payload },
      }

    case 'SET_UPDATING_PROJECT':
      return {
        ...state,
        actions: { ...state.actions, updatingProject: action.payload },
      }

    case 'SET_DELETING_PROJECT':
      return {
        ...state,
        actions: { ...state.actions, deletingProject: action.payload },
      }

    case 'SET_UPDATING_STATUS':
      return {
        ...state,
        actions: { ...state.actions, updatingStatus: action.payload },
      }

    default:
      return state
  }
}

// Custom hook
export const useAppState = () => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Action creators
  const setProjects = useCallback(
    (projects: (Project | ProjectListItem)[], totalPages: number, totalProjects: number) => {
      dispatch({
        type: 'SET_PROJECTS',
        payload: { projects, totalPages, totalProjects },
      })
    },
    []
  )

  const setCurrentPage = useCallback((page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page })
  }, [])

  const updateProject = useCallback((project: Project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project })
  }, [])

  const addProject = useCallback((project: Project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project })
  }, [])

  const removeProject = useCallback((projectId: number) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: projectId })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const setStatuses = useCallback((statuses: string[]) => {
    dispatch({ type: 'SET_STATUSES', payload: statuses })
  }, [])

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search })
  }, [])

  const setStatusFilter = useCallback((status: string) => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: status })
  }, [])

  const resetSearch = useCallback(() => {
    dispatch({ type: 'RESET_SEARCH' })
  }, [])

  // Modal actions
  const openCreateModal = useCallback(() => {
    dispatch({ type: 'OPEN_CREATE_MODAL' })
  }, [])

  const closeCreateModal = useCallback(() => {
    dispatch({ type: 'CLOSE_CREATE_MODAL' })
  }, [])

  const openEditModal = useCallback((project: Project) => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: project })
  }, [])

  const closeEditModal = useCallback(() => {
    dispatch({ type: 'CLOSE_EDIT_MODAL' })
  }, [])

  const setEditDirty = useCallback((dirty: boolean) => {
    dispatch({ type: 'SET_EDIT_DIRTY', payload: dirty })
  }, [])

  const openDeleteModal = useCallback((id: number, name: string) => {
    dispatch({ type: 'OPEN_DELETE_MODAL', payload: { id, name } })
  }, [])

  const closeDeleteModal = useCallback(() => {
    dispatch({ type: 'CLOSE_DELETE_MODAL' })
  }, [])

  const openUnsavedModal = useCallback(() => {
    dispatch({ type: 'OPEN_UNSAVED_MODAL' })
  }, [])

  const closeUnsavedModal = useCallback(() => {
    dispatch({ type: 'CLOSE_UNSAVED_MODAL' })
  }, [])

  const closeAllModals = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL_MODALS' })
  }, [])

  // Action loading states
  const setCreatingProject = useCallback((creating: boolean) => {
    dispatch({ type: 'SET_CREATING_PROJECT', payload: creating })
  }, [])

  const setUpdatingProject = useCallback((updating: boolean) => {
    dispatch({ type: 'SET_UPDATING_PROJECT', payload: updating })
  }, [])

  const setDeletingProject = useCallback((deleting: boolean) => {
    dispatch({ type: 'SET_DELETING_PROJECT', payload: deleting })
  }, [])

  const setUpdatingStatus = useCallback((projectId: number | null) => {
    dispatch({ type: 'SET_UPDATING_STATUS', payload: projectId })
  }, [])

  return {
    // State
    ...state,

    // Actions
    setProjects,
    setCurrentPage,
    updateProject,
    addProject,
    removeProject,
    setLoading,
    setError,
    setStatuses,
    setSearch,
    setStatusFilter,
    resetSearch,

    // Modal actions
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

    // Action loading states
    setCreatingProject,
    setUpdatingProject,
    setDeletingProject,
    setUpdatingStatus,
  }
}
