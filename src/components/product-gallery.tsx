'use client'

import { useState, type ReactNode } from 'react'
import { ProductImage } from './product-image'

type ProductGalleryProps = {
  images: string[]
  alt: string
  overlayTopLeft?: ReactNode
  overlayTopRight?: ReactNode
}

export function ProductGallery({ images, alt, overlayTopLeft, overlayTopRight }: ProductGalleryProps) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : ['']
  const [activeIndex, setActiveIndex] = useState(0)

  const current = safeImages[Math.min(activeIndex, safeImages.length - 1)]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden border border-(--color-border) bg-(--color-surface-hover)">
        <ProductImage src={current} alt={alt} className="w-full h-full object-cover" />
        {overlayTopLeft && <div className="absolute top-3 left-3 z-10">{overlayTopLeft}</div>}
        {overlayTopRight && <div className="absolute top-3 right-3 z-10">{overlayTopRight}</div>}
      </div>
      {safeImages.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {safeImages.map((src, index) => (
            <button
              key={src || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 rounded-md overflow-hidden border transition-opacity ${
                index === activeIndex
                  ? 'border-(--color-link) opacity-100'
                  : 'border-(--color-border) opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <ProductImage src={src} alt={alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

