import { useCallback, useState } from 'react'

import type { ToastType } from '../components/shared'

interface ToastState {
  type: ToastType
  message: string
  isVisible: boolean
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    type: 'success',
    message: '',
    isVisible: false,
  })

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message, isVisible: true })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  return {
    toast,
    showToast,
    hideToast,
  }
}
