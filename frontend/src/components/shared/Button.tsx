import type { LucideIcon } from 'lucide-react'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

import LoadingSpinner from './LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'coral'
  loading?: boolean
  loadingText?: string
  icon?: LucideIcon
  children: ReactNode
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  coral: 'bg-coral text-white hover:bg-coral-hover',
}

const Button = ({
  variant = 'primary',
  loading = false,
  loadingText,
  icon: Icon,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`align-center flex cursor-pointer items-center justify-center gap-2 rounded px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="small" />
          {loadingText || children}
        </>
      ) : (
        <>
          {Icon && <Icon className="h-5 w-5" />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button
