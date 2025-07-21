import { useCallback, useReducer } from 'react'

import type { Project } from '../services/api'

// Modal state interface
interface ModalState {
  createModal: boolean
  editModal: {
    open: boolean
    project: Project | null
    dirty: boolean
  }
  deleteModal: {
    open: boolean
    id: number | null
    name: string
  }
  unsavedModal: boolean
}

// Modal action types
type ModalAction =
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

// Initial modal state
const initialModalState: ModalState = {
  createModal: false,
  editModal: {
    open: false,
    project: null,
    dirty: false,
  },
  deleteModal: {
    open: false,
    id: null,
    name: '',
  },
  unsavedModal: false,
}

// Modal reducer function
const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_CREATE_MODAL':
      return { ...state, createModal: true }

    case 'CLOSE_CREATE_MODAL':
      return { ...state, createModal: false }

    case 'OPEN_EDIT_MODAL':
      return {
        ...state,
        editModal: {
          open: true,
          project: action.payload,
          dirty: false,
        },
      }

    case 'CLOSE_EDIT_MODAL':
      return {
        ...state,
        editModal: {
          open: false,
          project: null,
          dirty: false,
        },
      }

    case 'SET_EDIT_DIRTY':
      return {
        ...state,
        editModal: {
          ...state.editModal,
          dirty: action.payload,
        },
      }

    case 'OPEN_DELETE_MODAL':
      return {
        ...state,
        deleteModal: {
          open: true,
          id: action.payload.id,
          name: action.payload.name,
        },
      }

    case 'CLOSE_DELETE_MODAL':
      return {
        ...state,
        deleteModal: {
          open: false,
          id: null,
          name: '',
        },
      }

    case 'OPEN_UNSAVED_MODAL':
      return { ...state, unsavedModal: true }

    case 'CLOSE_UNSAVED_MODAL':
      return { ...state, unsavedModal: false }

    case 'CLOSE_ALL_MODALS':
      return {
        createModal: false,
        editModal: {
          open: false,
          project: null,
          dirty: false,
        },
        deleteModal: {
          open: false,
          id: null,
          name: '',
        },
        unsavedModal: false,
      }

    default:
      return state
  }
}

// Custom modal hook
export const useModalReducer = () => {
  const [state, dispatch] = useReducer(modalReducer, initialModalState)

  // Action creators
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

  return {
    // State
    ...state,

    // Actions
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
  }
}
