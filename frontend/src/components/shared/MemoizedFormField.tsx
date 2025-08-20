import React from 'react'
import type { ReactNode } from 'react'

interface MemoizedFormFieldProps {
  label: string
  children: ReactNode
  error?: string
  required?: boolean
  className?: string
  description?: string
  htmlFor?: string
}

const MemoizedFormField = React.memo(
  ({
    label,
    children,
    error,
    required = false,
    className = '',
    description,
    htmlFor,
  }: MemoizedFormFieldProps) => {
    return (
      <label className={`flex flex-col gap-1 ${className}`} htmlFor={htmlFor}>
        <span className="font-medium">
          {label}
          {required && (
            <span className="text-coral ml-1" aria-label="required">
              *
            </span>
          )}
        </span>
        {description && <span className="text-xs text-gray-600">{description}</span>}
        {children}
        {error && (
          <span className="text-coral text-xs" role="alert">
            {error}
          </span>
        )}
      </label>
    )
  }
)

MemoizedFormField.displayName = 'MemoizedFormField'

export default MemoizedFormField
