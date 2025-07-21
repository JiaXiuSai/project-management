interface CancelButtonProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children?: React.ReactNode
  className?: string
}

const CancelButton = ({
  disabled = false,
  loading = false,
  onClick,
  children = 'Cancel',
  className = '',
}: CancelButtonProps) => {
  return (
    <button
      className={`rounded bg-gray-200 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default CancelButton
