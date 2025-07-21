import { useCallback, useEffect, useRef, useState } from 'react'

import { SEARCH_DEBOUNCE_MS } from '../constants'

interface UseSearchProps {
  onSearchChange: (search: string) => void
  debounceMs?: number
}

export const useSearch = ({ onSearchChange, debounceMs = SEARCH_DEBOUNCE_MS }: UseSearchProps) => {
  const [searchInput, setSearchInput] = useState('')
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange(searchInput)
    }, debounceMs)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchInput, onSearchChange, debounceMs])

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchInput('')
    onSearchChange('')
  }, [onSearchChange])

  const resetSearch = useCallback(() => {
    setSearchInput('')
    onSearchChange('')
  }, [onSearchChange])

  return {
    searchInput,
    handleSearchInputChange,
    clearSearch,
    resetSearch,
  }
}
