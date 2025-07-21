import { Plus } from 'lucide-react'

import LoadingSpinner from '../shared/LoadingSpinner'

interface CreateButtonProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

const CreateButton = ({ disabled = false, loading = false, onClick }: CreateButtonProps) => {
  return (
    <button
      className="bg-primary hover:bg-primary-hover mt-2 flex items-center justify-center gap-2 rounded px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      type="submit"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <LoadingSpinner size="small" />
          Creating...
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create
        </div>
      )}
    </button>
  )
}

export default CreateButton
