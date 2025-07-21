import React from 'react'

import { ErrorBoundary } from './shared/ErrorBoundary'

interface AppErrorBoundaryProps {
  children: React.ReactNode
}

const AppFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
    <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-xl">
      <div className="mb-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>

      <h1 className="mb-4 text-2xl font-bold text-gray-900">Application Error</h1>

      <p className="mb-6 leading-relaxed text-gray-600">
        We're sorry, but something went wrong with the application. This might be due to a temporary
        issue or a problem with your connection.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary-dark w-full rounded-lg px-6 py-3 font-medium text-white transition-colors"
        >
          Reload Application
        </button>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500">
          If the problem persists, please contact support with the error details.
        </p>
      </div>
    </div>
  </div>
)

export const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={<AppFallback />}
      onError={(error, errorInfo) => {
        console.error('Critical Application Error:', error)
        console.error('Error Info:', errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
