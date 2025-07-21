import type { LucideIcon } from 'lucide-react'

import LoadingSpinner from '../shared/LoadingSpinner'

interface ActionButtonProps {
  icon?: LucideIcon
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'coral'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ActionButton = ({
  icon: Icon,
  disabled = false,
  loading = false,
  onClick,
  children,
  loadingText,
  variant = 'primary',
  size = 'md',
  className = '',
}: ActionButtonProps) => {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    coral: 'bg-coral text-white hover:bg-coral-hover',
  }

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      className={`flex items-center gap-2 rounded ${variantClasses[variant]} ${sizeClasses[size]} transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <LoadingSpinner size="small" />
          {loadingText || children}
        </>
      ) : (
        <>
          {Icon && <Icon className={iconSizes[size]} />}
          {children}
        </>
      )}
    </button>
  )
}

export default ActionButton
