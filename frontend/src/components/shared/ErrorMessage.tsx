import { AlertCircle, RefreshCw } from 'lucide-react'

import { ActionButton } from '../buttons'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

const ErrorMessage = ({ message, onRetry, className = '' }: ErrorMessageProps) => {
  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="text-coral mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onRetry && (
          <ActionButton
            icon={RefreshCw}
            onClick={onRetry}
            variant="coral"
            size="sm"
            className="ml-3 flex-shrink-0"
          >
            Try Again
          </ActionButton>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
