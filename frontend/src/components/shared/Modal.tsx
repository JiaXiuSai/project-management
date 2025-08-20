import { X } from 'lucide-react'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { IconButton } from '../buttons'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' // Modal size: small, medium, large
}

const Modal = ({ isOpen, onClose, title, children, size = 'sm' }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const sizeClass =
    size === 'lg'
      ? 'md:max-w-[800px] md:w-[90vw]'
      : size === 'md'
        ? 'md:max-w-[500px] md:w-[80vw]'
        : 'md:max-w-[400px] md:w-[70vw]'

  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)

    // Focus the modal when it opens
    const focusModal = () => {
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        if (firstElement) {
          firstElement.focus()
        }
      }
    }

    // Use setTimeout to ensure the modal is rendered
    setTimeout(focusModal, 0)

    return () => {
      window.removeEventListener('keydown', handleEsc)
      // Restore focus when modal closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-2 pt-[10vh] md:p-4 md:pt-[15vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      data-testid="modal-backdrop"
    >
      <div
        ref={modalRef}
        className={`relative max-h-[85vh] w-full rounded-lg bg-white shadow-lg md:h-auto md:max-h-[90vh] md:p-6 ${sizeClass} flex max-w-full flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-3 md:p-0 md:pb-4">
          {title && (
            <h3 id="modal-title" className="text-lg font-bold text-gray-900">
              {title}
            </h3>
          )}
          <IconButton
            icon={X}
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-700 md:absolute md:right-4 md:top-4"
            size="lg"
            aria-label="Close"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-3 md:p-0 md:px-4 md:pt-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
