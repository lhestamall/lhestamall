'use client'

import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/context/wishlist-context'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useToast } from '@/context/toast-context'

type AddToWishlistButtonProps = {
  productId: number
  variant?: 'icon' | 'text'
  className?: string
}

export function AddToWishlistButton({ productId, variant = 'icon', className = '' }: AddToWishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const inList = isInWishlist(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setBusy(true)
    try {
      if (inList) {
        await removeItem(productId)
        toast('Removed from wishlist', 'success')
      } else {
        await addItem(productId)
        toast('Added to wishlist', 'success')
      }
    } catch {
      toast('Something went wrong', 'error')
    } finally {
      setBusy(false)
    }
  }

  if (variant === 'text') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={`inline-flex items-center gap-2 text-sm font-bold ${className}`}
      >
        {busy ? <LoadingSpinner size="sm" /> : <Heart className={`w-4 h-4 ${inList ? 'fill-red-500 text-red-500' : ''}`} />}
        {inList ? 'In wishlist' : 'Add to wishlist'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={inList ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`p-2 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50 ${className}`}
    >
      {busy ? (
        <LoadingSpinner size="sm" className="text-gray-500 dark:text-gray-400" />
      ) : (
        <Heart className={`w-5 h-5 ${inList ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
      )}
    </button>
  )
}
