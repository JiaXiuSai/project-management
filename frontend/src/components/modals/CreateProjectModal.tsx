import React, { useMemo } from 'react'

import { useProjectForm } from '../../hooks/useProjectForm'
import { getFieldError } from '../../utils/validation'
import type { ProjectFormData } from '../../utils/validation'
import { CreateButton } from '../buttons'
import { MemoizedFormField, Modal } from '../shared'

type CreateProjectModalProps = {
  isOpen: boolean
  onClose: () => void
  statuses: string[]
  onSubmit: (data: ProjectFormData) => void | Promise<void>
  loading?: boolean
}

const CreateProjectModal = React.memo(
  ({ isOpen, onClose, statuses, onSubmit, loading = false }: CreateProjectModalProps) => {
    const { register, handleSubmit, errors, isSubmitting, reset } = useProjectForm({
      statuses,
      onSubmit,
    })

    React.useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          reset()
        }, 0)
        return () => clearTimeout(timer)
      }
    }, [isOpen, reset])

    // Memoize status options to prevent re-renders
    const statusOptions = useMemo(() => {
      return statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))
    }, [statuses])

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Create Project" size="lg">
        <form className="-m-1 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:flex-row">
            <MemoizedFormField
              label="Project Name"
              error={getFieldError(errors, 'name')}
              required
              className="md:flex-2 w-full p-1"
            >
              <input
                {...register('name')}
                className={`focus:ring-primary focus:border-primary h-[32px] w-full rounded border px-2 py-1 text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
                  getFieldError(errors, 'name') ? 'border-coral' : ''
                }`}
                placeholder="Enter project name"
                disabled={loading}
                aria-describedby={getFieldError(errors, 'name') ? 'name-error' : undefined}
                aria-invalid={!!getFieldError(errors, 'name')}
              />
              {getFieldError(errors, 'name') && (
                <div id="name-error" className="sr-only" role="alert">
                  {getFieldError(errors, 'name')}
                </div>
              )}
            </MemoizedFormField>

            <MemoizedFormField
              label="Status"
              error={getFieldError(errors, 'status')}
              required
              className="w-full p-1 md:flex-1"
            >
              <select
                {...register('status')}
                className={`focus:ring-primary focus:border-primary h-[32px] w-full rounded border px-2 py-1 font-semibold transition-colors focus:outline-none focus:ring-2 ${
                  getFieldError(errors, 'status') ? 'border-coral' : ''
                }`}
                disabled={loading}
                aria-describedby={getFieldError(errors, 'status') ? 'status-error' : undefined}
                aria-invalid={!!getFieldError(errors, 'status')}
              >
                {statusOptions}
              </select>
              {getFieldError(errors, 'status') && (
                <div id="status-error" className="sr-only" role="alert">
                  {getFieldError(errors, 'status')}
                </div>
              )}
            </MemoizedFormField>
          </div>

          <MemoizedFormField label="Description" className="p-1">
            <textarea
              {...register('description')}
              className="focus:ring-primary focus:border-primary min-h-[100px] resize-y rounded border px-2 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2"
              rows={5}
              placeholder="Enter project description"
              disabled={loading}
            />
          </MemoizedFormField>

          <CreateButton
            disabled={!isSubmitting && Object.keys(errors).length > 0}
            loading={loading || isSubmitting}
          />
        </form>
      </Modal>
    )
  }
)

export default CreateProjectModal
