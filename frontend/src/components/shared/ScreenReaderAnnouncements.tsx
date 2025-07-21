import React from 'react'

interface ScreenReaderAnnouncementsProps {
  loading: boolean
  error: string | null
  projectsCount: number
  totalProjects: number
}

const ScreenReaderAnnouncements: React.FC<ScreenReaderAnnouncementsProps> = ({
  loading,
  error,
  projectsCount,
  totalProjects,
}) => {
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {loading && 'Loading projects'}
      {error && `Error: ${error}`}
      {!loading &&
        !error &&
        projectsCount > 0 &&
        `Showing ${projectsCount} of ${totalProjects} projects`}
      {!loading && !error && projectsCount === 0 && 'No projects found'}
    </div>
  )
}

export default ScreenReaderAnnouncements
