import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toast).toEqual({
      type: 'success',
      message: '',
      isVisible: false,
    })
  })

  it('should show toast with success type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('success', 'Operation completed successfully')
    })

    expect(result.current.toast).toEqual({
      type: 'success',
      message: 'Operation completed successfully',
      isVisible: true,
    })
  })

  it('should show toast with error type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('error', 'Something went wrong')
    })

    expect(result.current.toast).toEqual({
      type: 'error',
      message: 'Something went wrong',
      isVisible: true,
    })
  })

  it('should show toast with warning type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('warning', 'Please check your input')
    })

    expect(result.current.toast).toEqual({
      type: 'warning',
      message: 'Please check your input',
      isVisible: true,
    })
  })

  it('should show toast with info type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('info', 'New update available')
    })

    expect(result.current.toast).toEqual({
      type: 'info',
      message: 'New update available',
      isVisible: true,
    })
  })

  it('should hide toast when hideToast is called', () => {
    const { result } = renderHook(() => useToast())

    // First show a toast
    act(() => {
      result.current.showToast('success', 'Test message')
    })

    expect(result.current.toast.isVisible).toBe(true)

    // Then hide it
    act(() => {
      result.current.hideToast()
    })

    expect(result.current.toast.isVisible).toBe(false)
    expect(result.current.toast.message).toBe('Test message')
    expect(result.current.toast.type).toBe('success')
  })

  it('should preserve toast type and message when hiding', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('error', 'Error message')
    })

    act(() => {
      result.current.hideToast()
    })

    expect(result.current.toast).toEqual({
      type: 'error',
      message: 'Error message',
      isVisible: false,
    })
  })

  it('should allow multiple showToast calls with different values', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('success', 'First message')
    })

    expect(result.current.toast).toEqual({
      type: 'success',
      message: 'First message',
      isVisible: true,
    })

    act(() => {
      result.current.showToast('error', 'Second message')
    })

    expect(result.current.toast).toEqual({
      type: 'error',
      message: 'Second message',
      isVisible: true,
    })
  })

  it('should handle empty message strings', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('info', '')
    })

    expect(result.current.toast).toEqual({
      type: 'info',
      message: '',
      isVisible: true,
    })
  })

  it('should handle long message strings', () => {
    const { result } = renderHook(() => useToast())
    const longMessage =
      'This is a very long message that might contain a lot of text and should still work properly with the toast system'

    act(() => {
      result.current.showToast('warning', longMessage)
    })

    expect(result.current.toast).toEqual({
      type: 'warning',
      message: longMessage,
      isVisible: true,
    })
  })

  it('should maintain state between renders', () => {
    const { result, rerender } = renderHook(() => useToast())

    act(() => {
      result.current.showToast('success', 'Persistent message')
    })

    // Re-render the hook
    rerender()

    expect(result.current.toast).toEqual({
      type: 'success',
      message: 'Persistent message',
      isVisible: true,
    })
  })

  it('should have stable function references', () => {
    const { result, rerender } = renderHook(() => useToast())

    const initialShowToast = result.current.showToast
    const initialHideToast = result.current.hideToast

    rerender()

    expect(result.current.showToast).toBe(initialShowToast)
    expect(result.current.hideToast).toBe(initialHideToast)
  })
})
