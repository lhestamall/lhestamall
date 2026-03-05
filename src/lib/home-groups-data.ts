import type { HomeGroupDef } from '@/config/home-groups'
import {
  HOME_GROUP_CATEGORY_LIMIT,
  NEW_ARRIVALS_DAYS,
  TRENDING_DAYS,
} from '@/config/home-groups'

type SupabaseClient = Awaited<ReturnType<typeof import('@/utils/supabase/server').createClient>>

/** Categories ordered by total quantity sold (for fallback when order data unavailable). */
async function getFeaturedCategories(
  supabase: SupabaseClient,
  limit: number
): Promise<string[]> {
  const { data: rows } = await supabase.from('products').select('category').not('category', 'is', null)
  const countByCategory: Record<string, number> = {}
  for (const r of rows ?? []) {
    const c = r.category as string
    if (c) countByCategory[c] = (countByCategory[c] ?? 0) + 1
  }
  return Object.entries(countByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat)
    .slice(0, limit)
}

/**
 * Returns category names that belong to this group, in display order.
 * Best selling = by quantity sold; Trending = by quantity sold in recent period; New arrivals = products since cutoff date.
 */
export async function getCategoriesForGroup(
  supabase: SupabaseClient,
  group: HomeGroupDef
): Promise<string[]> {
  const limit = HOME_GROUP_CATEGORY_LIMIT

  switch (group.strategy) {
    case 'new_arrivals': {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - NEW_ARRIVALS_DAYS)
      const cutoffIso = cutoff.toISOString()
      const { data: products } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)
        .gte('created_at', cutoffIso)
        .order('created_at', { ascending: false })
      const seen = new Set<string>()
      const ordered: string[] = []
      for (const p of products ?? []) {
        const c = p.category as string
        if (c && !seen.has(c)) {
          seen.add(c)
          ordered.push(c)
          if (ordered.length >= limit) break
        }
      }
      return ordered
    }

    case 'pre_order': {
      const { data: products } = await supabase
        .from('products')
        .select('category')
        .eq('is_pre_order', true)
        .not('category', 'is', null)
      const categories = Array.from(new Set((products ?? []).map((p) => p.category as string).filter(Boolean)))
      return categories.slice(0, limit)
    }

    case 'best_selling': {
      const { data: orderItems } = await supabase.from('order_items').select('product_id, quantity')
      if (!orderItems?.length) return getFeaturedCategories(supabase, limit)
      const qtyByProduct: Record<number, number> = {}
      for (const o of orderItems) {
        const id = o.product_id as number
        if (id) qtyByProduct[id] = (qtyByProduct[id] ?? 0) + Number(o.quantity ?? 0)
      }
      const productIds = Object.keys(qtyByProduct).map(Number)
      const { data: products } = await supabase.from('products').select('id, category').in('id', productIds).not('category', 'is', null)
      const qtyByCategory: Record<string, number> = {}
      for (const p of products ?? []) {
        const c = p.category as string
        if (c) qtyByCategory[c] = (qtyByCategory[c] ?? 0) + (qtyByProduct[p.id] ?? 0)
      }
      return Object.entries(qtyByCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat)
        .slice(0, limit)
    }

    case 'trending': {
      const since = new Date()
      since.setDate(since.getDate() - TRENDING_DAYS)
      const sinceIso = since.toISOString()
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity, orders!inner(created_at)')
      if (!orderItems?.length) return getFeaturedCategories(supabase, limit)
      const filtered = orderItems.filter((o: { orders?: { created_at?: string } | Array<{ created_at?: string }> }) => {
        const created = Array.isArray(o.orders) ? o.orders[0]?.created_at : o.orders?.created_at
        return (created ?? '') >= sinceIso
      })
      if (!filtered.length) return getFeaturedCategories(supabase, limit)
      const qtyByProduct: Record<number, number> = {}
      for (const o of filtered) {
        const id = (o as { product_id: number; quantity?: number }).product_id
        const qty = (o as { product_id: number; quantity?: number }).quantity ?? 0
        if (id) qtyByProduct[id] = (qtyByProduct[id] ?? 0) + Number(qty)
      }
      const productIds = Object.keys(qtyByProduct).map(Number)
      const { data: products } = await supabase.from('products').select('id, category').in('id', productIds).not('category', 'is', null)
      const qtyByCategory: Record<string, number> = {}
      for (const p of products ?? []) {
        const c = p.category as string
        if (c) qtyByCategory[c] = (qtyByCategory[c] ?? 0) + (qtyByProduct[p.id] ?? 0)
      }
      return Object.entries(qtyByCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat)
        .slice(0, limit)
    }

    case 'featured':
      return getFeaturedCategories(supabase, limit)

    case 'deals':
      return []
  }
}

export type CategoryHero = {
  category: string
  heroProduct: { id: number; name: string; image_url?: string | null; image_urls?: string[] | null } | null
}

/**
 * For each given category, get the hero product (e.g. newest in category) for the card image.
 */
export async function getCategoryHeroesForCategories(
  supabase: SupabaseClient,
  categories: string[]
): Promise<CategoryHero[]> {
  if (categories.length === 0) return []

  const heroes: CategoryHero[] = await Promise.all(
    categories.map(async (category) => {
      const { data: products } = await supabase
        .from('products')
        .select('id, name, image_url, image_urls')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(1)
      return {
        category,
        heroProduct: products?.[0] ?? null,
      }
    })
  )
  return heroes
}
