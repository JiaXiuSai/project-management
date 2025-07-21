import { CreateButton } from '../buttons'

interface ProjectListHeaderProps {
  onCreateClick: () => void
  disabled?: boolean
}

const ProjectListHeader = ({ onCreateClick, disabled = false }: ProjectListHeaderProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold">Projects</h2>
      <CreateButton disabled={disabled} onClick={onCreateClick} />
    </div>
  )
}

export default ProjectListHeader
