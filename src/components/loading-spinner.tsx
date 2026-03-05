'use client'

import { Loader2 } from 'lucide-react'

type LoadingSpinnerProps = {
  /** Size: sm (16px), md (24px), lg (32px) */
  size?: 'sm' | 'md' | 'lg'
  /** Optional class for the wrapper */
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

/** Theme-aware spinner (uses currentColor so parent can set text color). */
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-gray-500 dark:text-gray-400 ${sizeClasses[size]} ${className}`}
      aria-hidden
    />
  )
}
