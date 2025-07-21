import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import React from 'react'

import { type SearchFormData, searchFormSchema } from '../utils/validation'

interface UseSearchFormProps {
  defaultValues?: Partial<SearchFormData>
  onSubmit: (data: SearchFormData) => void
  debounceMs?: number
}

export const useSearchForm = ({
  defaultValues,
  onSubmit,
  debounceMs = 300,
}: UseSearchFormProps) => {
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: '',
      ...defaultValues,
    },
    mode: 'onChange', // Validate on change for search
  })

  const { register, watch, setValue } = form

  // Watch search value for debounced submission
  const searchValue = watch('search')

  // Debounced search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSubmit({ search: searchValue || '' })
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [searchValue, onSubmit, debounceMs])

  const clearSearch = () => {
    setValue('search', '')
  }

  return {
    register,
    searchValue,
    clearSearch,
    form,
  }
}
