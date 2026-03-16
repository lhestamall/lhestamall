import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ChevronRight, CreditCard, PiggyBank, Truck, Mail } from 'lucide-react'
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
        {/* Hero: reference style – orange heading, Ghana subheading, CTA, right image */}
        <section className="relative bg-(--color-surface) overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'%23000\' d=\'M50 0L100 50 50 100 0 50z\'/%3E%3C/svg%3E")', backgroundSize: '120px' }} aria-hidden />
          <div className="ds-container relative py-10 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--color-hero-accent) leading-tight max-w-xl">
                  Shop Smart. Import Better.
                </h1>
                <p className="mt-3 sm:mt-4 text-body sm:text-title-sm text-(--color-text) max-w-md">
                  Quality Imports at Better Prices for Ghana 🇬🇭
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center min-h-12 px-6 mt-6 rounded-sm bg-(--color-cta-bg) text-(--color-cta-text) text-body-sm font-semibold hover:opacity-95 transition-opacity"
                >
                  Explore Our Products
                </Link>
              </div>
              <div className="relative aspect-4/3 max-w-lg mx-auto lg:max-w-none rounded-xl overflow-hidden bg-(--color-surface-hover)">
                <div className="absolute inset-0 flex items-center justify-center text-(--color-text-muted) text-body-sm">
                  <span className="text-center px-4">Quality imports for your lifestyle</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust cards: between hero and first section, floating on the line */}
        <div className="relative z-10 -mt-10 sm:-mt-14 px-4 sm:px-6 lg:px-8">
          <div className="ds-container">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-(--color-surface) rounded-xl p-5 sm:p-6 border border-(--color-border) shadow-lg">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-(--color-bg) text-(--color-link) mb-3">
                  <CreditCard className="w-5 h-5" aria-hidden />
                </div>
                <h3 className="text-title-sm font-semibold text-(--color-text) mb-1.5">Secure Payments</h3>
                <p className="text-body-sm text-(--color-text-muted)">Protected checkout and secure payment options for your peace of mind.</p>
              </div>
              <div className="bg-(--color-surface) rounded-xl p-5 sm:p-6 border border-(--color-border) shadow-lg">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-(--color-bg) text-(--color-link) mb-3">
                  <PiggyBank className="w-5 h-5" aria-hidden />
                </div>
                <h3 className="text-title-sm font-semibold text-(--color-text) mb-1.5">Affordable Prices</h3>
                <p className="text-body-sm text-(--color-text-muted)">Quality imports at better prices, tailored for Ghana.</p>
              </div>
              <div className="bg-(--color-surface) rounded-xl p-5 sm:p-6 border border-(--color-border) shadow-lg">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-(--color-bg) text-(--color-link) mb-3">
                  <Truck className="w-5 h-5" aria-hidden />
                </div>
                <h3 className="text-title-sm font-semibold text-(--color-text) mb-1.5">Trusted Delivery</h3>
                <p className="text-body-sm text-(--color-text-muted)">Reliable shipping and delivery so your orders arrive on time.</p>
              </div>
            </div>
          </div>
        </div>

        {groupSections.map(({ group, heroes }, index) => (
            <section
              key={group.id}
              className={`ds-container ${index === 0 ? 'pt-16 sm:pt-20' : ''} py-6 sm:py-10`}
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
                className="flex-1 min-h-11 px-4 rounded-sm bg-(--color-surface) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-link) text-body-sm"
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
