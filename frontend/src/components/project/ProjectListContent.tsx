import React from 'react'

import type { Project, ProjectListItem } from '../../services/api'
import LoadingSpinner from '../shared/LoadingSpinner'
import Pagination from '../shared/Pagination'
import ProjectCard from './ProjectCard'

interface ProjectListContentProps {
  projects: (Project | ProjectListItem)[]
  loading: boolean
  search: string
  statuses: string[]
  currentPage: number
  totalPages: number
  updatingStatus: number | null
  onEdit: (project: Project | ProjectListItem) => void
  onStatusChange: (id: number, status: string) => void
  onPageChange: (page: number) => void
  disabled?: boolean
}

const ProjectListContent = React.memo(
  ({
    projects,
    loading,
    search,
    statuses,
    currentPage,
    totalPages,
    updatingStatus,
    onEdit,
    onStatusChange,
    onPageChange,
    disabled = false,
  }: ProjectListContentProps) => {
    return (
      <div className="flex min-h-[600px] flex-col">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex-1 py-12 text-center text-gray-500">
            {search ? 'No projects found matching your search.' : 'No projects found.'}
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  statuses={statuses}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                  isUpdatingStatus={updatingStatus !== null}
                  updatingStatusId={updatingStatus}
                  disabled={disabled}
                />
              ))}
            </div>

            {/* Pagination - Always visible when there are multiple pages */}
            {totalPages > 1 && (
              <div className="mt-auto pt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    )
  }
)

export default ProjectListContent
