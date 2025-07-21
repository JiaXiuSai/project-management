import { useEffect } from 'react'

interface KeyboardShortcutsProps {
  onFocusSearch?: () => void
  onCloseModals?: () => void
  disabled?: boolean
}

export const useKeyboardShortcuts = ({
  onFocusSearch,
  onCloseModals,
  disabled = false,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        onFocusSearch?.()
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        onCloseModals?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onFocusSearch, onCloseModals, disabled])
}
