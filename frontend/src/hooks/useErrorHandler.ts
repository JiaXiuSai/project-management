import { useCallback } from 'react'

interface ErrorHandlerOptions {
  onError?: (error: Error, context?: string) => void
  showToast?: (type: 'error' | 'success', message: string) => void
  logToConsole?: boolean
}

interface ErrorContext {
  component?: string
  action?: string
  additionalData?: Record<string, unknown>
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { onError, showToast, logToConsole = process.env.NODE_ENV === 'development' } = options

  const handleError = useCallback(
    (error: Error | unknown, context?: ErrorContext) => {
      // Convert unknown errors to Error objects
      const errorObj = error instanceof Error ? error : new Error(String(error))

      // Add context to error message if provided
      if (context?.component || context?.action) {
        const contextInfo = [
          context.component && `Component: ${context.component}`,
          context.action && `Action: ${context.action}`,
        ]
          .filter(Boolean)
          .join(', ')

        errorObj.message = `${errorObj.message} (${contextInfo})`
      }

      // Log to console in development
      if (logToConsole) {
        console.error('Error handled by useErrorHandler:', errorObj)
        if (context?.additionalData) {
          console.error('Additional context:', context.additionalData)
        }
      }

      // Call custom error handler
      onError?.(errorObj, context?.component)

      // Show toast notification if available
      if (showToast) {
        const userFriendlyMessage = getErrorMessage(errorObj)
        showToast('error', userFriendlyMessage)
      }

      // In a production app, you would send this to an error reporting service
      // Example:
      // errorReportingService.captureException(errorObj, {
      //   extra: context?.additionalData,
      //   tags: {
      //     component: context?.component,
      //     action: context?.action
      //   }
      // });

      return errorObj
    },
    [onError, showToast, logToConsole]
  )

  const handleAsyncError = useCallback(
    async <T>(asyncFn: () => Promise<T>, context?: ErrorContext): Promise<T | null> => {
      try {
        return await asyncFn()
      } catch (error) {
        handleError(error, context)
        return null
      }
    },
    [handleError]
  )

  const createErrorBoundary = useCallback(
    (context?: ErrorContext) => ({
      onError: (error: Error, errorInfo: React.ErrorInfo) => {
        handleError(error, {
          ...context,
          additionalData: {
            ...context?.additionalData,
            componentStack: errorInfo.componentStack,
          },
        })
      },
    }),
    [handleError]
  )

  return {
    handleError,
    handleAsyncError,
    createErrorBoundary,
  }
}

// Helper function to get user-friendly error messages
const getErrorMessage = (error: Error): string => {
  // Handle common error types
  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }

  if (error.name === 'AbortError') {
    return 'Request was cancelled.'
  }

  if (error.message.includes('404')) {
    return 'The requested resource was not found.'
  }

  if (error.message.includes('403')) {
    return "You don't have permission to perform this action."
  }

  if (error.message.includes('500')) {
    return 'Server error. Please try again later.'
  }

  // Handle validation errors
  if (error.message.includes('validation') || error.message.includes('required')) {
    return 'Please check your input and try again.'
  }

  // Default message
  return 'Something went wrong. Please try again.'
}

// Hook for handling API errors specifically
export const useApiErrorHandler = (
  showToast?: (type: 'error' | 'success', message: string) => void
) => {
  return useErrorHandler({
    showToast,
    onError: (error) => {
      // You could add API-specific error handling here
      // For example, handling different HTTP status codes
      console.error(`API Error:`, error)
    },
  })
}
