import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { AddToWishlistButton } from '@/components/add-to-wishlist-button'
import { ProductImage } from '@/components/product-image'
import { Price } from '@/components/price'
import { ProductRating } from '@/components/product-rating'
import { ShopFilters } from '@/components/shop-filters'
import { getProductImageUrl } from '@/lib/product'

export const dynamic = 'force-dynamic'

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

  const { data: categoryData } = await supabase.from('products').select('category')
  const categories = Array.from(new Set(categoryData?.map((p) => p.category).filter(Boolean)))

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
  if (queryParam) query = query.or(`name.ilike.%${queryParam}%,description.ilike.%${queryParam}%`)
  if (minPrice) query = query.gte('price', Number(minPrice))
  if (maxPrice) query = query.lte('price', Number(maxPrice))
  if (availability === 'instock') query = query.eq('is_pre_order', false).gt('stock_quantity', 0)
  else if (availability === 'preorder') query = query.eq('is_pre_order', true)

  const { data: products, error } = await query

  if (error) {
    // Handle error gracefully if needed
  }

  return (
    <div className="flex flex-col min-h-screen bg-(--color-bg) text-(--color-text)">
      <main className="flex-1">
        <div className="flex flex-col">
        <section className="bg-(--color-surface) py-5 sm:py-8" style={{ ['--pill-fade-color' as string]: 'var(--color-surface)' }}>
          <div className="ds-container">
            <div className="max-w-3xl mb-4 sm:mb-6">
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

            <div className="mt-4 sm:mt-6 pill-scroll-fade -mx-4 sm:-mx-6 lg:-mx-8" style={{ ['--pill-fade-color' as string]: 'var(--color-surface)' }}>
              <div className="overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8">
                <div className="flex gap-2 w-max min-w-full pb-2" style={{ gap: 'var(--space-2)' }}>
                  <Link
                    href={
                    availability === 'all' && !queryParam && sortParam === 'newest' && !minPrice && !maxPrice
                      ? '/shop'
                      : `/shop?${new URLSearchParams({
                          ...(availability !== 'all' && { availability }),
                          ...(queryParam && { q: queryParam }),
                          ...(sortParam !== 'newest' && { sort: sortParam }),
                          ...(minPrice && { minPrice }),
                          ...(maxPrice && { maxPrice }),
                        }).toString()}`
                    }
                    className={`shrink-0 inline-flex items-center rounded-full px-4 py-2 text-body-sm font-medium transition-colors ${
                      !selectedCategory
                        ? 'bg-(--color-link) text-(--color-cta-text)'
                        : 'bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-link) hover:text-(--color-cta-text)'
                    }`}
                  >
                    All
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/shop?category=${encodeURIComponent(category)}`}
                      className={`shrink-0 inline-flex items-center rounded-full px-4 py-2 text-body-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-(--color-link) text-(--color-cta-text)'
                          : 'bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-link) hover:text-(--color-cta-text)'
                      }`}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="ds-container py-5 sm:py-8 lg:py-12">
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            <div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 min-w-0">
              <ShopFilters />
              <div className="hidden sm:flex shrink-0 items-center gap-1.5 h-10 px-3 text-body-sm font-medium text-(--color-text-muted) bg-(--color-surface) rounded-full">
                <span>Available:</span>
                <span className="text-(--color-text) font-semibold">{products?.length ?? 0}</span>
              </div>
            </div>
            <p className="sm:hidden text-body-sm text-(--color-text-muted)">
              Available: <span className="text-(--color-text) font-semibold">{products?.length ?? 0}</span>
            </p>
          </div>
          <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 sm:gap-4">
          {!products || products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-10 sm:py-16 lg:py-24 px-6 text-center">
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
                className="flex flex-col rounded-xl bg-(--color-surface) overflow-hidden break-inside-avoid mb-2 sm:mb-4 last:mb-0"
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
                  <Price amount={product.price} size="card" className="text-(--color-text)" />
                  <h3 className="text-body-sm font-bold leading-snug">
                    <Link href={`/shop/${product.id}`} className="text-(--color-text) hover:underline hover:text-(--color-text)">
                      {product.name}
                    </Link>
                  </h3>
                  <ProductRating rating={product.rating} ratingCount={product.rating_count} className="text-label font-light" />
                  <div className="mt-auto pt-2 min-h-11 flex items-end">
                    <Link
                      href={`/shop/${product.id}`}
                      className="btn-secondary w-full justify-center text-body-sm font-semibold"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
