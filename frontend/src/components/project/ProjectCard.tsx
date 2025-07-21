import React from 'react'

import type { Project, ProjectListItem } from '../../services/api'

interface ProjectCardProps {
  project: Project | ProjectListItem
  statuses: string[]
  onEdit: (project: Project | ProjectListItem) => void
  onStatusChange: (id: number, status: string) => void
  isUpdatingStatus: boolean
  updatingStatusId: number | null
  disabled?: boolean
}

const ProjectCard = React.memo(
  ({
    project,
    statuses,
    onEdit,
    onStatusChange,
    isUpdatingStatus,
    updatingStatusId,
    disabled = false,
  }: ProjectCardProps) => {
    const isUpdating = isUpdatingStatus && updatingStatusId === project.id

    return (
      <div className="flex flex-col gap-4 rounded-lg border bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-1">
          <button
            className="text-primary hover:text-primary-hover w-fit cursor-pointer border-none bg-transparent p-0 text-left text-lg font-bold transition-colors"
            onClick={() => onEdit(project)}
            aria-label={`Edit project: ${project.name}`}
            title="Edit project"
          >
            {project.name}
          </button>
          {project.description && (
            <span
              className="mt-1 line-clamp-2 text-sm text-gray-600"
              id={`project-${project.id}-status`}
            >
              {project.description}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="focus:ring-primary focus:border-primary h-[32px] min-w-[120px] rounded border px-2 py-1 font-semibold transition-colors focus:outline-none focus:ring-2"
            value={project.status}
            onChange={(e) => onStatusChange(project.id, e.target.value)}
            disabled={disabled || isUpdating}
            aria-label={`Change status for project: ${project.name}`}
            aria-describedby={`project-${project.id}-status`}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }
)

export default ProjectCard
