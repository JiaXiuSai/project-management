import { CheckCircle, X, XCircle } from 'lucide-react'

import { useEffect, useState } from 'react'

import { TOAST_DURATION } from '../../constants'
import { IconButton } from '../buttons'

export type ToastType = 'success' | 'error'

interface ToastProps {
  type: ToastType
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

const Toast = ({ type, message, isVisible, onClose, duration = TOAST_DURATION }: ToastProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50'
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200'
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800'
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500'
  const Icon = type === 'success' ? CheckCircle : XCircle

  return (
    <div
      className={`fixed right-4 top-4 z-50 w-full max-w-sm ${bgColor} border ${borderColor} rounded-lg p-4 shadow-lg transition-all duration-300 ${
        isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-center">
        <Icon className={`h-10 w-10 ${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="ml-3 flex-1">
          <p className={`text-lg font-medium ${textColor}`}>
            {type === 'success' ? 'Success' : 'Error'}
          </p>
          <p className={`text-sm ${textColor} mt-1`}>{message}</p>
        </div>
        <IconButton
          icon={X}
          onClick={() => {
            setIsAnimating(false)
            setTimeout(onClose, 300)
          }}
          className={`ml-3 flex-shrink-0 ${textColor} hover:opacity-70`}
          size="sm"
          variant="ghost"
        />
      </div>
    </div>
  )
}

export default Toast
