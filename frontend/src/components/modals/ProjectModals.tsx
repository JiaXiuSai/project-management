import React from 'react'

import type { Project } from '../../services/api'
import type { ProjectFormData } from '../../utils/validation'
import { CreateProjectModal, DeleteProjectModal, EditProjectModal } from './index'

interface ProjectModalsProps {
  // Create modal
  createModalOpen: boolean
  onCreateClose: () => void
  onCreateSubmit: (data: ProjectFormData) => void | Promise<void>
  creatingProject: boolean

  // Edit modal
  editModalOpen: boolean
  editProject: Project | null
  onEditClose: () => void
  onEditSubmit: (data: ProjectFormData) => void | Promise<void>
  onEditDelete: () => void

  updatingProject: boolean

  // Delete modal
  deleteModalOpen: boolean
  deleteProjectName: string
  onDeleteClose: () => void
  onDeleteConfirm: () => void | Promise<void>
  deletingProject: boolean

  // Common props
  statuses: string[]
}

const ProjectModals: React.FC<ProjectModalsProps> = ({
  createModalOpen,
  onCreateClose,
  onCreateSubmit,
  creatingProject,
  editModalOpen,
  editProject,
  onEditClose,
  onEditSubmit,
  onEditDelete,
  updatingProject,
  deleteModalOpen,
  deleteProjectName,
  onDeleteClose,
  onDeleteConfirm,
  deletingProject,
  statuses,
}) => {
  return (
    <>
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={onCreateClose}
        statuses={statuses}
        onSubmit={onCreateSubmit}
        loading={creatingProject}
      />

      <EditProjectModal
        isOpen={editModalOpen}
        onClose={onEditClose}
        statuses={statuses}
        project={editProject}
        onSubmit={onEditSubmit}
        onDelete={onEditDelete}
        loading={updatingProject}
      />

      <DeleteProjectModal
        isOpen={deleteModalOpen}
        onClose={onDeleteClose}
        name={deleteProjectName}
        onDelete={onDeleteConfirm}
        loading={deletingProject}
      />
    </>
  )
}

export default ProjectModals
