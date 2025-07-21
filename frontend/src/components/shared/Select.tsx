import type { ReactNode, SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  children: ReactNode
}

const Select = ({ label, error, helperText, children, className = '', ...props }: SelectProps) => (
  <label className="flex w-full flex-col gap-1">
    {label && <span className="text-sm font-medium">{label}</span>}
    <select
      className={`h-[32px] rounded border px-2 py-1 font-semibold ${
        error ? 'border-red-500' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </select>
    {helperText && !error && <span className="text-xs text-gray-500">{helperText}</span>}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
)

export default Select
