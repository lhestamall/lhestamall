'use client'

import { useEffect } from 'react'
import { useWishlist } from '@/context/wishlist-context'
import { useUser } from '@/context/user-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ArrowRight, ExternalLink, X } from 'lucide-react'
import { getProductImageUrl } from '@/lib/product'
import { ProductImage } from '@/components/product-image'
import { Price } from '@/components/price'

export default function WishlistPage() {
  const { items, isLoading, removeItem } = useWishlist()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user && !isLoading) router.replace('/login')
  }, [user, isLoading, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-(--color-bg) py-8 sm:py-12">
      <div className="ds-container max-w-4xl">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-heading font-bold text-(--color-text)">Wishlist</h1>
          <Link
            href="/shop"
            className="ds-link inline-flex items-center gap-2 text-body-sm font-medium w-fit"
          >
            Continue shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-(--color-surface-hover) animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-(--color-surface) p-10 sm:p-14 text-center">
            <div className="w-16 h-16 rounded-full bg-(--color-surface-hover) flex items-center justify-center mx-auto mb-5">
              <Heart className="w-8 h-8 text-(--color-text-muted)" />
            </div>
            <p className="text-title font-semibold text-(--color-text)">Your wishlist is empty</p>
            <p className="text-body-sm text-(--color-text-muted) mt-2 max-w-sm mx-auto">
              Save items you’re interested in—especially pre-orders—so you don’t miss them.
            </p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 mt-8">
              Browse shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-stretch gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-(--color-surface) hover:shadow-sm transition-shadow"
              >
                <Link
                  href={`/shop/${item.product_id}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-(--color-surface-hover)"
                >
                  <ProductImage
                    src={getProductImageUrl(item.product)}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-label text-(--color-text-muted) uppercase tracking-wide block">
                        {item.product.category ?? 'Product'}
                      </span>
                      <Link
                        href={`/shop/${item.product_id}`}
                        className="font-semibold text-body-sm text-(--color-text) line-clamp-1 hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-body-sm font-medium text-(--color-text) mt-0.5">
                        <Price amount={item.product.price} size="inline" />
                      </p>
                      {item.product.is_pre_order && (
                        <span className="text-label font-semibold uppercase tracking-wider text-(--color-warning) mt-1 inline-block">
                          Pre-order
                          {item.product.pre_order_release_date && (
                            <span className="ml-1 font-normal normal-case">
                              · {new Date(item.product.pre_order_release_date).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      )}
                      {!item.product.is_pre_order && item.product.stock_quantity === 0 && (
                        <span className="text-label text-(--color-text-muted) font-medium mt-1 inline-block">
                          Out of stock
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 rounded-lg text-(--color-text-muted) hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors shrink-0"
                      aria-label="Remove from wishlist"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-start gap-2 mt-2">
                    <Link
                      href={`/shop/${item.product_id}`}
                      className="btn-secondary inline-flex items-center gap-1.5 justify-center px-3 py-2 text-label"
                    >
                      View product <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
