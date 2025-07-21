import { LoaderCircle } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const LoadingSpinner = ({ size = 'medium', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoaderCircle className={`text-primary animate-spin ${sizeClasses[size]}`} />
    </div>
  )
}

export default LoadingSpinner
