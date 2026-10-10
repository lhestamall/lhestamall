import { getProductImageUrl } from '@/lib/product'

type SupabaseClient = Awaited<ReturnType<typeof import('@/utils/supabase/server').createClient>>

export type SpotlightLayout = 'single' | 'grid2' | 'featured'

export type SpotlightImage = {
  src: string
  label: string
}

export type HomeSpotlightCard = {
  id: string
  headline: string
  ctaLabel: string
  href: string
  layout: SpotlightLayout
  images: SpotlightImage[]
}

type ProductRow = {
  id: number
  name: string | null
  category: string | null
  image_url?: string | null
  image_urls?: string[] | null
  is_pre_order?: boolean | null
}

function toLabel(p: ProductRow): string {
  const name = String(p.name ?? '')
  return name.length > 22 ? `${name.slice(0, 20)}…` : name || 'Product'
}

function toSpotlightImage(p: ProductRow): SpotlightImage {
  return {
    src: getProductImageUrl(p)!,
    label: toLabel(p),
  }
}

/**
 * Story-driven spotlight tiles (not "top categories" — avoids repeating the category nav).
 * Uses diverse products & real destinations: new arrivals, full shop, pre-orders.
 */
export async function getHomeSpotlightCards(supabase: SupabaseClient): Promise<HomeSpotlightCard[]> {
  const { data: raw } = await supabase
    .from('products')
    .select('id, name, category, image_url, image_urls, is_pre_order, created_at')
    .order('created_at', { ascending: false })
    .limit(96)

  const pool = (raw ?? []).filter((p) => getProductImageUrl(p)) as ProductRow[]
  if (pool.length === 0) return []

  const used = new Set<number>()
  const cards: HomeSpotlightCard[] = []

  const takeDiverse = (min: number, preferDistinctCategory: boolean): ProductRow[] => {
    const out: ProductRow[] = []
    const cats = new Set<string>()
    for (const p of pool) {
      if (used.has(p.id)) continue
      const c = p.category as string | null
      if (preferDistinctCategory && c && cats.has(c)) continue
      if (c) cats.add(c)
      out.push(p)
      used.add(p.id)
      if (out.length >= min) break
    }
    if (out.length < min) {
      for (const p of pool) {
        if (used.has(p.id)) continue
        out.push(p)
        used.add(p.id)
        if (out.length >= min) break
      }
    }
    return out.slice(0, min)
  }

  // 1 — Newest single (always)
  const first = pool[0]
  used.add(first.id)
  cards.push({
    id: 'spotlight-just-landed',
    headline: 'Just landed',
    ctaLabel: 'See new arrivals',
    href: '/shop?sort=newest',
    layout: 'single',
    images: [toSpotlightImage(first)],
  })

  // 2 — Cross-category grid (4 different products; prefer different categories)
  if (pool.length >= 5) {
    const diverse = takeDiverse(4, true)
    if (diverse.length >= 4) {
      cards.push({
        id: 'spotlight-cross-store',
        headline: 'Across the store',
        ctaLabel: 'Browse everything',
        href: '/shop',
        layout: 'grid2',
        images: diverse.map(toSpotlightImage),
      })
    }
  }

  // 3 — Pre-order story (if any), else skip to avoid mirroring empty preorder nav
  const preorderAvailable = pool.some((p) => p.is_pre_order)
  if (preorderAvailable) {
    const pre = pool.filter((p) => p.is_pre_order && !used.has(p.id))
    if (pre.length >= 4) {
      const chunk = pre.slice(0, 4)
      chunk.forEach((p) => used.add(p.id))
      cards.push({
        id: 'spotlight-preorder',
        headline: 'Pre-order & incoming',
        ctaLabel: 'Reserve upcoming items',
        href: '/shop?availability=preorder',
        layout: 'featured',
        images: chunk.map(toSpotlightImage),
      })
    } else if (pre.length >= 1) {
      const p = pre[0]
      used.add(p.id)
      cards.push({
        id: 'spotlight-preorder',
        headline: 'Pre-order & incoming',
        ctaLabel: 'See pre-orders',
        href: '/shop?availability=preorder',
        layout: 'single',
        images: [toSpotlightImage(p)],
      })
    }
  }

  // 4 — Different products + different destination than “Browse everything” (avoids two identical CTAs)
  if (cards.length < 4 && pool.length >= 8) {
    const more = takeDiverse(4, true)
    if (more.length >= 4) {
      cards.push({
        id: 'spotlight-more',
        headline: 'Still browsing?',
        ctaLabel: 'Shop A–Z',
        href: '/shop?sort=name',
        layout: 'grid2',
        images: more.map(toSpotlightImage),
      })
    }
  }

  // Small catalog: avoid a wall of similar “Browse” tiles — show at most two stories
  if (pool.length <= 14) {
    return cards.slice(0, 2)
  }

  return cards.slice(0, 4)
}
