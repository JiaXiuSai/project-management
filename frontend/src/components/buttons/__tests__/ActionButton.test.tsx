import { Plus, Trash2 } from 'lucide-react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen } from '../../../test/utils'
import ActionButton from '../ActionButton'

// Mock the LoadingSpinner component
vi.mock('../shared/LoadingSpinner', () => ({
  default: ({ size }: { size: string }) => (
    <div data-testid={`loading-spinner-${size}`}>Loading...</div>
  ),
}))

describe('ActionButton', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props', () => {
    render(<ActionButton {...defaultProps} />)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary', 'text-white', 'px-4', 'py-2')
  })

  it('renders with custom children', () => {
    render(<ActionButton {...defaultProps} children="Custom Text" />)

    expect(screen.getByRole('button', { name: 'Custom Text' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<ActionButton {...defaultProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('renders with icon when provided', () => {
    render(<ActionButton {...defaultProps} icon={Plus} />)

    const icon = screen.getByRole('button').querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<ActionButton {...defaultProps} variant="primary" />)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')

    rerender(<ActionButton {...defaultProps} variant="secondary" />)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200')

    rerender(<ActionButton {...defaultProps} variant="danger" />)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')

    rerender(<ActionButton {...defaultProps} variant="coral" />)
    expect(screen.getByRole('button')).toHaveClass('bg-coral')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<ActionButton {...defaultProps} size="sm" />)
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1', 'text-sm')

    rerender(<ActionButton {...defaultProps} size="md" />)
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2')

    rerender(<ActionButton {...defaultProps} size="lg" />)
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('applies custom className', () => {
    render(<ActionButton {...defaultProps} className="custom-class" />)

    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('shows loading state when loading is true', () => {
    render(<ActionButton {...defaultProps} loading={true} />)

    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('shows loading text when loading is true and loadingText is provided', () => {
    render(<ActionButton {...defaultProps} loading={true} loadingText="Processing..." />)

    expect(screen.getByText('Processing...')).toBeInTheDocument()
    expect(screen.queryByText('Click me')).not.toBeInTheDocument()
  })

  it('shows children text when loading is true but no loadingText is provided', () => {
    render(<ActionButton {...defaultProps} loading={true} />)

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<ActionButton {...defaultProps} disabled={true} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when loading prop is true', () => {
    render(<ActionButton {...defaultProps} loading={true} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has correct icon sizes for different button sizes', () => {
    const { rerender } = render(<ActionButton {...defaultProps} icon={Plus} size="sm" />)
    let icon = screen.getByRole('button').querySelector('svg')
    expect(icon).toHaveClass('w-4', 'h-4')

    rerender(<ActionButton {...defaultProps} icon={Plus} size="md" />)
    icon = screen.getByRole('button').querySelector('svg')
    expect(icon).toHaveClass('w-5', 'h-5')

    rerender(<ActionButton {...defaultProps} icon={Plus} size="lg" />)
    icon = screen.getByRole('button').querySelector('svg')
    expect(icon).toHaveClass('w-6', 'h-6')
  })

  it('does not call onClick when disabled', () => {
    const mockOnClick = vi.fn()
    render(<ActionButton {...defaultProps} onClick={mockOnClick} disabled={true} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', () => {
    const mockOnClick = vi.fn()
    render(<ActionButton {...defaultProps} onClick={mockOnClick} loading={true} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('renders with icon and text in correct order', () => {
    render(<ActionButton {...defaultProps} icon={Trash2} children="Delete" />)

    const button = screen.getByRole('button', { name: 'Delete' })
    const icon = button.querySelector('svg')
    const text = button.querySelector('span') || button.lastChild

    expect(button.firstChild).toBe(icon)
    expect(text).toHaveTextContent('Delete')
  })

  it('has correct disabled styles', () => {
    render(<ActionButton {...defaultProps} disabled={true} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('has correct transition styles', () => {
    render(<ActionButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('transition-colors')
  })
})
