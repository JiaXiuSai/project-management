import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCallback } from 'react'

import type { Project } from '../services/api'
import { type ProjectFormData, projectFormSchema } from '../utils/validation'

interface UseProjectFormProps {
  defaultValues?: Partial<ProjectFormData>
  onSubmit: (data: ProjectFormData) => void | Promise<void>
  statuses: string[]
}

export const useProjectForm = ({ defaultValues, onSubmit, statuses }: UseProjectFormProps) => {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: statuses[0] || '',
      ...defaultValues,
    },
    mode: 'onSubmit', // Only validate on submit to prevent initial error states
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = form

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (data: ProjectFormData) => {
      try {
        await onSubmit(data)
        // Reset form on successful submission
        reset()
      } catch {
        // Error handling is done in the parent component
      }
    },
    [onSubmit, reset]
  )

  // Reset form with new default values
  const resetForm = useCallback(
    (newDefaults?: Partial<ProjectFormData>) => {
      reset({
        name: '',
        description: '',
        status: statuses[0] || '',
        ...newDefaults,
      })
    },
    [reset, statuses]
  )

  // Set form values (useful for editing existing projects)
  const setFormValues = useCallback(
    (project: Partial<Project>) => {
      // Use reset with the project values to ensure proper form state
      reset({
        name: project.name || '',
        description: project.description || '',
        status: project.status || statuses[0] || '',
      })
    },
    [reset, statuses]
  )

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    isSubmitting,
    isValid,
    isDirty,
    reset: resetForm,
    setFormValues,
    form, // Expose the full form object for advanced usage
  }
}
