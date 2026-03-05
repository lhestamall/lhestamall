'use client'

import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 dark:bg-zinc-900 ${className ?? ''}`}>
        <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
          <ImageIcon className="w-10 h-10 opacity-40" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Preview unavailable
          </span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
    />
  )
}


