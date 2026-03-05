'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-950 rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            We couldn’t complete your request. Please try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-5 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
