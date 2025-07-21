import { RefreshCw } from 'lucide-react'

import React from 'react'

import { ErrorBoundary } from '../shared/ErrorBoundary'

interface ProjectListErrorBoundaryProps {
  children: React.ReactNode
  onRetry?: () => void
}

const ProjectListFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
    <div className="mb-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    </div>

    <h3 className="mb-2 text-lg font-semibold text-gray-900">Failed to Load Projects</h3>

    <p className="mb-4 max-w-md text-center text-gray-600">
      We encountered an error while loading your projects. This might be a temporary issue.
    </p>

    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-primary hover:bg-primary-dark inline-flex items-center rounded-lg px-4 py-2 text-white transition-colors"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </button>
    )}
  </div>
)

export const ProjectListErrorBoundary: React.FC<ProjectListErrorBoundaryProps> = ({
  children,
  onRetry,
}) => {
  return (
    <ErrorBoundary
      fallback={<ProjectListFallback onRetry={onRetry} />}
      onError={(error, errorInfo) => {
        // Log project-specific errors
        console.error('ProjectList Error:', error)
        console.error('Error Info:', errorInfo)

        // You could also send this to an error reporting service
        // like Sentry, LogRocket, etc.
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
