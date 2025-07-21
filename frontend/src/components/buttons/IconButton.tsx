import type { LucideIcon } from 'lucide-react'

interface IconButtonProps {
  icon: LucideIcon
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'secondary' | 'danger'
  className?: string
  'aria-label'?: string
}

const IconButton = ({
  icon: Icon,
  disabled = false,
  loading = false,
  onClick,
  size = 'md',
  variant = 'ghost',
  className = '',
  'aria-label': ariaLabel,
}: IconButtonProps) => {
  const variantClasses = {
    ghost: 'text-gray-400 hover:text-gray-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'text-red-600 hover:text-red-700',
  }

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      className={`rounded transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon className={iconSizes[size]} />
    </button>
  )
}

export default IconButton
