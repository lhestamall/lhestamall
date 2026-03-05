'use client'

import { Star } from 'lucide-react'

/**
 * Displays a product rating as stars (1–5) plus optional review count.
 * Use on cards where rating/rating_count may be null or 0.
 */
export function ProductRating({
  rating,
  ratingCount = 0,
  className = '',
  showCount = true,
}: {
  rating: number | null | undefined
  ratingCount?: number | null
  className?: string
  showCount?: boolean
}) {
  const value = rating != null ? Number(rating) : null
  const count = ratingCount != null ? Number(ratingCount) : 0
  const hasRating = value != null && value >= 1 && value <= 5 && count > 0

  if (!hasRating) {
    return (
      <span className={`text-label font-light text-(--color-text-muted) ${className}`.trim()}>
        No reviews
      </span>
    )
  }

  const fullStars = Math.round(value!)
  const emptyStars = 5 - fullStars

  return (
    <span className={`inline-flex items-center gap-1 flex-wrap ${className}`.trim()}>
      <span className="inline-flex items-center" aria-label={`Rating: ${value} out of 5`}>
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`f-${i}`} className="w-3.5 h-3.5 fill-(--color-warning) text-(--color-warning)" aria-hidden />
        ))}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star key={`e-${i}`} className="w-3.5 h-3.5 text-(--color-border)" aria-hidden />
        ))}
      </span>
      {showCount && count > 0 && (
        <span className="text-label font-light text-(--color-text-muted)">({count})</span>
      )}
    </span>
  )
}
