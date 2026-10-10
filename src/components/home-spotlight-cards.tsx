import Link from 'next/link'
import { ProductImage } from '@/components/product-image'
import type { HomeSpotlightCard } from '@/lib/home-spotlights'

export function HomeSpotlightCards({ cards }: { cards: HomeSpotlightCard[] }) {
  if (!cards.length) return null

  return (
    <section
      className="border-y border-(--color-border)/50 bg-(--color-surface-hover)/35 py-8 sm:py-10"
      aria-label="Featured collections"
    >
      <div className="ds-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card) => (
            <article
              key={card.id}
              className="flex flex-col h-full bg-(--color-surface) rounded-xl border border-(--color-border) p-4 sm:p-5 shadow-sm"
            >
              <h2 className="text-body sm:text-title-sm font-bold text-(--color-text) mb-3 sm:mb-4 leading-snug">
                {card.headline}
              </h2>

              <div className="flex-1 flex flex-col min-h-[200px] sm:min-h-[220px]">
                {card.layout === 'single' && card.images[0] && (
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-(--color-surface-hover)">
                    <ProductImage
                      src={card.images[0].src}
                      alt={card.images[0].label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {card.layout === 'grid2' && (
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 flex-1 content-start">
                    {card.images.slice(0, 4).map((img, i) => (
                      <div key={`${card.id}-g-${i}`} className="flex flex-col gap-1 min-w-0">
                        <div className="relative aspect-square overflow-hidden rounded-md bg-(--color-surface-hover)">
                          <ProductImage src={img.src} alt={img.label} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[11px] sm:text-xs text-(--color-text-muted) leading-tight line-clamp-2">
                          {img.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {card.layout === 'featured' && card.images.length >= 4 && (
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-(--color-surface-hover)">
                      <ProductImage
                        src={card.images[0].src}
                        alt={card.images[0].label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {card.images.slice(1, 4).map((img, i) => (
                        <div key={`${card.id}-f-${i}`} className="flex flex-col gap-1 min-w-0">
                          <div className="relative aspect-square overflow-hidden rounded-md bg-(--color-surface-hover)">
                            <ProductImage src={img.src} alt={img.label} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-(--color-text-muted) line-clamp-2 leading-tight">
                            {img.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={card.href}
                className="mt-4 text-body-sm font-semibold text-(--color-link) hover:underline inline-flex self-start"
              >
                {card.ctaLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
