import Link from 'next/link'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-950 rounded-2xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm text-center space-y-6">
        <p className="text-6xl font-black text-gray-200 dark:text-zinc-800">404</p>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Page not found</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Search className="w-4 h-4" />
            Browse shop
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
