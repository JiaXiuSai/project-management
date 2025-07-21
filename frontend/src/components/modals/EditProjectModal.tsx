import React, { useEffect, useMemo } from 'react'

import { useProjectForm } from '../../hooks/useProjectForm'
import type { Project } from '../../services/api'
import { getFieldError } from '../../utils/validation'
import type { ProjectFormData } from '../../utils/validation'
import { DeleteButton, SaveButton } from '../buttons'
import { MemoizedFormField, Modal } from '../shared'

type EditProjectModalProps = {
  isOpen: boolean
  onClose: () => void
  statuses: string[]
  project: Project | null
  onSubmit: (data: ProjectFormData) => void | Promise<void>
  onDelete: () => void

  loading?: boolean
}

const EditProjectModal = React.memo(
  ({
    isOpen,
    onClose,
    statuses,
    project,
    onSubmit,
    onDelete,
    loading = false,
  }: EditProjectModalProps) => {
    const { register, handleSubmit, errors, isSubmitting, setFormValues } = useProjectForm({
      statuses,
      onSubmit,
    })

    // Set form values when project changes or modal opens
    const prevProjectRef = React.useRef(project?.id)
    useEffect(() => {
      if (isOpen && project && prevProjectRef.current !== project.id) {
        prevProjectRef.current = project.id
        setFormValues(project)
      }
    }, [isOpen, project, setFormValues])

    // Memoize status options to prevent re-renders
    const statusOptions = useMemo(() => {
      return statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))
    }, [statuses])

    if (!project) return null

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Project" size="lg">
        <form onSubmit={handleSubmit} className="-m-1 flex flex-col gap-4">
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
              />
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
              >
                {statusOptions}
              </select>
            </MemoizedFormField>
          </div>

          <MemoizedFormField label="Description" className="p-1">
            <textarea
              {...register('description')}
              className="focus:ring-primary focus:border-primary min-h-[100px] w-full resize-y rounded border px-2 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2"
              rows={5}
              placeholder="Enter project description"
              disabled={loading}
            />
          </MemoizedFormField>

          <div className="mt-4 flex flex-row justify-end gap-2">
            <div className="flex justify-end">
              <DeleteButton onClick={onDelete} disabled={loading} />
            </div>
            <div className="flex justify-end">
              <SaveButton
                disabled={!isSubmitting && Object.keys(errors).length > 0}
                loading={loading || isSubmitting}
              />
            </div>
          </div>
        </form>
      </Modal>
    )
  }
)

export default EditProjectModal
