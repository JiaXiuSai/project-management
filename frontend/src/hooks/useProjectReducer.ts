import { useCallback, useReducer } from 'react'

import type { Project, ProjectListItem } from '../services/api'

// State interface
interface ProjectState {
  projects: (Project | ProjectListItem)[]
  totalPages: number
  totalProjects: number
  currentPage: number
  loading: boolean
  error: string | null
  statuses: string[]
  search: string
  searchInput: string
  statusFilter: string
  creatingProject: boolean
  updatingProject: boolean
  deletingProject: boolean
  updatingStatus: number | null
}

// Action types
type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'SET_PROJECTS'
      payload: {
        projects: (Project | ProjectListItem)[]
        totalPages: number
        totalProjects: number
      }
    }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_STATUSES'; payload: string[] }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_SEARCH_INPUT'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: string }
  | { type: 'SET_CREATING_PROJECT'; payload: boolean }
  | { type: 'SET_UPDATING_PROJECT'; payload: boolean }
  | { type: 'SET_DELETING_PROJECT'; payload: boolean }
  | { type: 'SET_UPDATING_STATUS'; payload: number | null }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: number }
  | { type: 'RESET_SEARCH' }

// Initial state
const initialState: ProjectState = {
  projects: [],
  totalPages: 1,
  totalProjects: 0,
  currentPage: 1,
  loading: true,
  error: null,
  statuses: [],
  search: '',
  searchInput: '',
  statusFilter: '',
  creatingProject: false,
  updatingProject: false,
  deletingProject: false,
  updatingStatus: null,
}

// Reducer function
const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload.projects,
        totalPages: action.payload.totalPages,
        totalProjects: action.payload.totalProjects,
      }

    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }

    case 'SET_STATUSES':
      return { ...state, statuses: action.payload }

    case 'SET_SEARCH':
      return { ...state, search: action.payload }

    case 'SET_SEARCH_INPUT':
      return { ...state, searchInput: action.payload }

    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload }

    case 'SET_CREATING_PROJECT':
      return { ...state, creatingProject: action.payload }

    case 'SET_UPDATING_PROJECT':
      return { ...state, updatingProject: action.payload }

    case 'SET_DELETING_PROJECT':
      return { ...state, deletingProject: action.payload }

    case 'SET_UPDATING_STATUS':
      return { ...state, updatingStatus: action.payload }

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

    case 'RESET_SEARCH':
      return {
        ...state,
        search: '',
        searchInput: '',
        currentPage: 1,
      }

    default:
      return state
  }
}

// Custom hook
export const useProjectReducer = () => {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  // Action creators
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

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

  const setStatuses = useCallback((statuses: string[]) => {
    dispatch({ type: 'SET_STATUSES', payload: statuses })
  }, [])

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search })
  }, [])

  const setSearchInput = useCallback((searchInput: string) => {
    dispatch({ type: 'SET_SEARCH_INPUT', payload: searchInput })
  }, [])

  const setStatusFilter = useCallback((statusFilter: string) => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: statusFilter })
  }, [])

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

  const updateProject = useCallback((project: Project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project })
  }, [])

  const addProject = useCallback((project: Project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project })
  }, [])

  const removeProject = useCallback((projectId: number) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: projectId })
  }, [])

  const resetSearch = useCallback(() => {
    dispatch({ type: 'RESET_SEARCH' })
  }, [])

  return {
    // State
    ...state,

    // Actions
    setLoading,
    setError,
    setProjects,
    setCurrentPage,
    setStatuses,
    setSearch,
    setSearchInput,
    setStatusFilter,
    setCreatingProject,
    setUpdatingProject,
    setDeletingProject,
    setUpdatingStatus,
    updateProject,
    addProject,
    removeProject,
    resetSearch,
  }
}
