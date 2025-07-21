import { Save } from 'lucide-react'

import LoadingSpinner from '../shared/LoadingSpinner'

interface SaveButtonProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children?: React.ReactNode
  loadingText?: string
}

const SaveButton = ({
  disabled = false,
  loading = false,
  onClick,
  children = 'Save',
  loadingText = 'Saving...',
}: SaveButtonProps) => {
  return (
    <button
      className="bg-primary hover:bg-primary-hover flex items-center gap-2 rounded px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      type="submit"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <LoadingSpinner size="small" />
          {loadingText}
        </>
      ) : (
        <>
          <Save className="h-5 w-5" />
          {children}
        </>
      )}
    </button>
  )
}

export default SaveButton
