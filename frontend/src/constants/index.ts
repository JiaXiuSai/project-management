// Pagination and API constants
export const PAGE_SIZE = 5
export const SEARCH_DEBOUNCE_MS = 300

// Toast durations
export const TOAST_DURATION = 5000

// API base URL (Should be in .env)
export const API_BASE_URL = 'http://localhost:5000/api'

// Default statuses (fallback)
export const DEFAULT_STATUSES = [
  'Backlog',
  'Planning',
  'In Progress',
  'On Hold',
  'Under Review',
  'Completed',
  'Cancelled',
]

// Form validation constants
export const MAX_PROJECT_NAME_LENGTH = 100
export const MIN_PROJECT_NAME_LENGTH = 1

// UI constants
export const MODAL_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const

export type ModalSize = keyof typeof MODAL_SIZES
