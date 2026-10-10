import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { AddToWishlistButton } from '@/components/add-to-wishlist-button'
import { ProductImage } from '@/components/product-image'
import { Price } from '@/components/price'
import { ProductRating } from '@/components/product-rating'
import { ShopFilters } from '@/components/shop-filters'
import { getProductImageUrl } from '@/lib/product'
import { buildProductSearchOrFilter } from '@/lib/shop-search'
import { SHOP_PAGE_DESCRIPTION } from '@/lib/site-seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  // Browser tab title stays \"LhestaMall\" (from root layout); this is for SEO/snippets only.
  description: SHOP_PAGE_DESCRIPTION,
  openGraph: {
    title: 'Shop All Products | Lhesta Mall',
    description: SHOP_PAGE_DESCRIPTION,
  },
  twitter: {
    title: 'Shop All Products | Lhesta Mall',
    description: SHOP_PAGE_DESCRIPTION,
    card: 'summary_large_image',
  },
}

export default async function ShopPage(props: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; minPrice?: string; maxPrice?: string; availability?: string }>
}) {
  const searchParams = await props.searchParams
  const selectedCategory = searchParams.category
  const queryParam = searchParams.q
  const sortParam = searchParams.sort || 'newest'
  const minPrice = searchParams.minPrice
  const maxPrice = searchParams.maxPrice
  const availability = searchParams.availability === 'instock' || searchParams.availability === 'preorder' ? searchParams.availability : 'all'

  const supabase = await createClient()

  let query = supabase.from('products').select('*')

  switch (sortParam) {
    case 'price-low':
      query = query.order('price', { ascending: true })
      break
    case 'price-high':
      query = query.order('price', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  if (selectedCategory) query = query.eq('category', selectedCategory)
  if (queryParam) {
    const searchOr = buildProductSearchOrFilter(queryParam)
    if (searchOr) query = query.or(searchOr)
  }
  if (minPrice) query = query.gte('price', Number(minPrice))
  if (maxPrice) query = query.lte('price', Number(maxPrice))
  if (availability === 'instock') query = query.eq('is_pre_order', false).gt('stock_quantity', 0)
  else if (availability === 'preorder') query = query.eq('is_pre_order', true)

  const { data: products, error } = await query

  return (
    <div className="flex flex-col min-h-screen bg-(--color-bg) text-(--color-text)">
      <main className="flex-1">
        <div className="flex flex-col">
        <section className="bg-(--color-surface) py-5 sm:py-8">
          <div className="ds-container">
            <div className="max-w-3xl mb-2 sm:mb-3">
              <h1 className="text-heading text-(--color-text) mb-1 sm:mb-2" style={{ marginBottom: 'var(--space-1)' }}>
                {queryParam ? `Search results for "${queryParam}"` : selectedCategory || 'All products'}
              </h1>
              <p className="text-body-sm text-(--color-text-muted)">
                {queryParam
                  ? `${products?.length ?? 0} results.`
                  : selectedCategory
                    ? `${selectedCategory} – browse below.`
                    : 'Browse our full collection.'}
              </p>
            </div>
          </div>
        </section>

        <div className="ds-container py-5 sm:py-8 lg:py-12">
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            <div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 min-w-0">
              <ShopFilters />
              <div className="hidden sm:flex shrink-0 items-center gap-1.5 h-10 px-3 text-body-sm font-medium text-(--color-text-muted) bg-(--color-surface) rounded-full">
                <span>Showing</span>
                <span className="text-(--color-text) font-semibold">{products?.length ?? 0}</span>
                <span className="hidden md:inline">products</span>
              </div>
            </div>
            <p className="sm:hidden text-body-sm text-(--color-text-muted)">
              <span className="text-(--color-text) font-semibold">{products?.length ?? 0}</span> products
            </p>
          </div>
          {error ? (
            <div className="ds-card rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-6 text-center">
              <p className="text-body-sm font-medium text-(--color-text)">Couldn&apos;t load products. Please refresh or try again shortly.</p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-label text-(--color-text-muted) mt-2 wrap-break-word">{error.message}</p>
              )}
            </div>
          ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          {!products || products.length === 0 ? (
            <div className="col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col items-center justify-center py-10 sm:py-16 lg:py-24 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-(--color-surface-hover) flex items-center justify-center mb-6">
                <span className="text-2xl text-(--color-text-muted)" aria-hidden>?</span>
              </div>
              <h2 className="text-title text-(--color-text) mb-2">
                {queryParam || selectedCategory || availability !== 'all' ? 'No products match' : 'No products yet'}
              </h2>
              <p className="text-body-sm text-(--color-text-muted) max-w-sm mb-8">
                {queryParam || selectedCategory || availability !== 'all'
                  ? 'Try changing your filters or search.'
                  : 'When products are added, they will show here.'}
              </p>
              <Link href="/shop" className="btn-primary">
                {queryParam || selectedCategory || availability !== 'all' ? 'Clear and browse all' : 'Browse shop'}
              </Link>
            </div>
          ) : (
            products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col rounded-xl bg-(--color-surface) overflow-hidden"
              >
                <Link
                  href={`/shop/${product.id}`}
                  className="aspect-4/5 relative overflow-hidden bg-(--color-surface-hover) block"
                >
                  <ProductImage
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {(product.is_pre_order || product.stock_quantity === 0) && (
                    <span
                      className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-label font-light leading-tight ${
                        product.is_pre_order
                          ? 'bg-(--color-surface-hover) text-(--color-text)'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                      }`}
                    >
                      {product.is_pre_order ? 'Pre-order' : 'Out of stock'}
                    </span>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <AddToWishlistButton productId={product.id} className="h-9 w-9 flex items-center justify-center rounded-md bg-(--color-surface) transition-colors" />
                  </div>
                </Link>
                <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0 gap-1.5">
                  <span className="text-label font-light text-(--color-text-muted) wrap-break-word">{product.category || 'Collection'}</span>
                  <h3 className="text-body-sm font-bold leading-snug">
                    <Link href={`/shop/${product.id}`} className="text-(--color-text) hover:underline hover:text-(--color-text)">
                      {product.name}
                    </Link>
                  </h3>
                  <Price amount={product.price} size="card" className="text-(--color-text)" />
                  <ProductRating rating={product.rating} ratingCount={product.rating_count} className="text-label font-light" />
                  <div className="mt-auto pt-2 min-h-11 flex items-end">
                    <Link
                      href={`/shop/${product.id}`}
                      className="btn-primary w-full justify-center text-body-sm font-semibold"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
          </div>
          )}
        </div>
        </div>
      </main>
    </div>
  )
}
