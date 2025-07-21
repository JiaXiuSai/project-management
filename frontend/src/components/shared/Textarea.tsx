import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = ({ label, error, helperText, className = '', ...props }: TextareaProps) => (
  <label className="flex w-full flex-col gap-1">
    {label && <span className="text-sm font-medium">{label}</span>}
    <textarea
      className={`rounded border px-2 py-1 text-gray-900 ${
        error ? 'border-red-500' : ''
      } ${className}`}
      {...props}
    />
    {helperText && !error && <span className="text-xs text-gray-500">{helperText}</span>}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
)

export default Textarea
