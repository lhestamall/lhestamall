'use client'

import { useFormStatus } from 'react-dom'
import { LoadingSpinner } from '@/components/loading-spinner'

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  loadingText?: string
}

/** Submit button that shows a theme-aware spinner while the form is submitting. */
export function SubmitButton({ children, loadingText, disabled, className = '', ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  const isDisabled = disabled || pending

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={className}
      aria-busy={pending}
      {...props}
    >
      {pending ? (
        <>
          <LoadingSpinner size="sm" className="shrink-0 text-current" />
          {loadingText != null ? loadingText : children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
