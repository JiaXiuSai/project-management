import { Trash2 } from 'lucide-react'

import Button from '../shared/Button'

interface DeleteButtonProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children?: React.ReactNode
  loadingText?: string
  variant?: 'danger' | 'coral'
}

const DeleteButton = ({
  disabled = false,
  loading = false,
  onClick,
  children = 'Delete',
  loadingText = 'Deleting...',
  variant = 'coral',
}: DeleteButtonProps) => {
  return (
    <Button
      variant={variant}
      loading={loading}
      loadingText={loadingText}
      icon={Trash2}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </Button>
  )
}

export default DeleteButton
