import { LoadingSpinner } from '@/components/loading-spinner'

/** Full-page loading fallback for route segments. Theme-aware. */
export function PageLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-white dark:bg-black">
      <LoadingSpinner size="lg" className="text-black dark:text-white" />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading…</p>
    </div>
  )
}
