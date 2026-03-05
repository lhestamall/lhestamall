import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ChevronRight, ShieldCheck, Truck, Package, Mail } from 'lucide-react'
import { ProductImage } from '@/components/product-image'
import { getProductImageUrl } from '@/lib/product'
import { HOME_GROUPS } from '@/config/home-groups'
import {
  getCategoriesForGroup,
  getCategoryHeroesForCategories,
  type CategoryHero,
} from '@/lib/home-groups-data'

export const dynamic = 'force-dynamic'

/** Category card under a group: image only, no category name (just the pic). */
function CategoryCard({ category, heroProduct }: CategoryHero) {
  const href = `/shop?category=${encodeURIComponent(category)}`
  const imageUrl = heroProduct ? getProductImageUrl(heroProduct) : null

  return (
    <Link
      href={href}
      aria-label={`Shop ${category}`}
      className="group block rounded-xl overflow-hidden bg-(--color-surface) transition-colors"
    >
      <div className="aspect-4/3 sm:aspect-3/2 relative overflow-hidden bg-(--color-surface-hover)">
        {imageUrl ? (
          <ProductImage
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-(--color-border)/30" aria-hidden>
            <span className="text-body-sm font-medium text-(--color-text-muted)">{category}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />
      </div>
    </Link>
  )
}

export default async function Home() {
  const supabase = await createClient()

  const { data: categoryData } = await supabase.from('products').select('category')
  const allCategories = Array.from(new Set(categoryData?.map((p) => p.category).filter(Boolean))) as string[]

  const rawSections = await Promise.all(
    HOME_GROUPS.map(async (group) => {
      const categories = await getCategoriesForGroup(supabase, group)
      const heroes = await getCategoryHeroesForCategories(supabase, categories)
      const visible = heroes.filter((h) => h.heroProduct && getProductImageUrl(h.heroProduct))
      return { group, heroes: visible }
    })
  )
  const groupSections = rawSections.filter((s) => s.heroes.length > 0)
  const visibleGroupCount = groupSections.length
  const useTwoColGridOnMobile = visibleGroupCount <= 2

  return (
    <div className="flex flex-col min-h-screen bg-(--color-bg) text-(--color-text)">
      <main className="flex-1">
        <section className="bg-(--color-surface) py-5 sm:py-8" style={{ ['--pill-fade-color' as string]: 'var(--color-surface)' }}>
          <div className="ds-container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div>
                <h1 className="text-heading text-(--color-text)">Shop by category</h1>
                <p className="text-body-sm text-(--color-text-muted) mt-1" style={{ marginTop: 'var(--space-1)' }}>
                  Browse our collection by category
                </p>
              </div>
              <Link href="/shop" className="ds-link inline-flex items-center text-title-sm font-semibold shrink-0">
                View all products
                <ChevronRight className="w-5 h-5 ml-1" style={{ width: '1.25rem', height: '1.25rem', marginLeft: 'var(--space-1)' }} aria-hidden />
              </Link>
            </div>

            <div className="mt-4 sm:mt-6 pill-scroll-fade -mx-4 sm:-mx-6 lg:-mx-8" style={{ ['--pill-fade-color' as string]: 'var(--color-surface)' }}>
              <div className="overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8">
                <div className="flex gap-2 w-max min-w-full pb-2" style={{ gap: 'var(--space-2)' }}>
                  {allCategories.length > 0 ? (
                    <>
                      <Link
                        href="/shop"
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-body-sm font-medium bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-link) hover:text-(--color-cta-text) transition-colors"
                      >
                        All
                      </Link>
                      {allCategories.map((category) => (
                        <Link
                          key={category}
                          href={`/shop?category=${encodeURIComponent(category)}`}
                          className="shrink-0 inline-flex items-center rounded-full px-4 py-2 text-body-sm font-medium bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-link) hover:text-(--color-cta-text) transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href="/shop"
                      className="shrink-0 inline-flex items-center rounded-full px-4 py-2 text-body-sm font-medium bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-link) hover:text-(--color-cta-text) transition-colors"
                    >
                      All products
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {groupSections.map(({ group, heroes }, index) => (
            <section
              key={group.id}
              className="ds-container py-6 sm:py-10"
            >
              <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
                <h2 className="text-section text-(--color-text)">{group.label}</h2>
                <Link
                  href="/shop"
                  className="ds-link inline-flex items-center text-body-sm font-semibold shrink-0"
                >
                  View all
                  <ChevronRight className="w-4 h-4 ml-0.5" style={{ width: '1rem', height: '1rem' }} aria-hidden />
                </Link>
              </div>
              {useTwoColGridOnMobile ? (
                /* <= 2 items: on mobile use 2-col grid; on tablet/desktop use normal grid */
                <div
                  className="grid gap-4 max-sm:grid-cols-2 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4"
                  style={{ gap: 'var(--space-4)' }}
                >
                  {heroes.map(({ category, heroProduct }) => (
                    <div key={`${group.id}-${category}`}>
                      <CategoryCard category={category} heroProduct={heroProduct} />
                    </div>
                  ))}
                </div>
              ) : (
                /* > 2 items: on mobile use horizontal scroll; on tablet/desktop use normal grid (never scroll) */
                <div
                  className="pill-scroll-fade pill-scroll-fade-soft -mx-4 sm:mx-0"
                  style={{ ['--pill-fade-color' as string]: 'var(--color-bg)' }}
                >
                  <div className="overflow-x-auto no-scrollbar px-4 sm:overflow-visible sm:px-0">
                    <div
                      className="flex gap-4 pb-2 w-max min-w-full sm:grid sm:w-auto sm:min-w-0 sm:pb-0 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4"
                      style={{ gap: 'var(--space-4)' }}
                    >
                      {heroes.map(({ category, heroProduct }) => (
                        <div key={`${group.id}-${category}`} className="shrink-0 w-56 sm:shrink sm:w-auto">
                          <CategoryCard category={category} heroProduct={heroProduct} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
        ))}

        <section className="bg-(--color-surface) py-4 sm:py-6">
          <div className="ds-container">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-(--color-bg)" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <ShieldCheck className="w-5 h-5 text-(--color-text-muted)" style={{ width: '1.25rem', height: '1.25rem' }} aria-hidden />
                </span>
                <div>
                  <span className="text-body-sm font-semibold text-(--color-text)">Secure checkout</span>
                  <p className="text-body-sm text-(--color-text-muted)">Protected payments</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-(--color-bg)" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <Truck className="w-5 h-5 text-(--color-text-muted)" style={{ width: '1.25rem', height: '1.25rem' }} aria-hidden />
                </span>
                <div>
                  <span className="text-body-sm font-semibold text-(--color-text)">Fast delivery</span>
                  <p className="text-body-sm text-(--color-text-muted)">2-day shipping</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-(--color-bg)" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <Package className="w-5 h-5 text-(--color-text-muted)" style={{ width: '1.25rem', height: '1.25rem' }} aria-hidden />
                </span>
                <div>
                  <span className="text-body-sm font-semibold text-(--color-text)">Easy returns</span>
                  <p className="text-body-sm text-(--color-text-muted)">Hassle-free</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="ds-container py-6 sm:py-10">
          <div className="ds-card p-4 sm:p-6 max-w-xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <Mail className="w-6 h-6 text-(--color-link)" style={{ width: '1.5rem', height: '1.5rem' }} aria-hidden />
              <h2 className="text-section text-(--color-text)">Stay updated</h2>
            </div>
            <p className="text-body-sm text-(--color-text-muted) mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              Get new arrivals and offers in your inbox. No spam; unsubscribe anytime.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-h-11 px-4 rounded-md bg-(--color-surface) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-link) text-body-sm"
              />
              <button type="submit" className="btn-primary shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
