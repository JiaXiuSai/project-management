import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const TextField = ({ label, error, helperText, className = '', ...props }: TextFieldProps) => (
  <label className="flex w-full flex-col gap-1">
    {label && <span className="text-sm font-medium">{label}</span>}
    <input
      className={`h-[32px] rounded border px-2 py-1 text-gray-900 ${
        error ? 'border-red-500' : ''
      } ${className}`}
      {...props}
    />
    {helperText && !error && <span className="text-xs text-gray-500">{helperText}</span>}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
)

export default TextField
