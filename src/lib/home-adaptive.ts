import type { HomeGroupDef } from '@/config/home-groups'
import type { CategoryHero } from '@/lib/home-groups-data'

type SupabaseClient = Awaited<ReturnType<typeof import('@/utils/supabase/server').createClient>>

export async function getHomeInventoryStats(supabase: SupabaseClient): Promise<{
  productCount: number
  distinctCategories: number
}> {
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { data: rows } = await supabase.from('products').select('category').not('category', 'is', null)
  const distinctCategories = new Set(
    (rows ?? []).map((r) => r.category as string).filter(Boolean)
  ).size
  return { productCount: count ?? 0, distinctCategories }
}

/** When the catalog is small, repeating Pre-order / New / Trending rows shows the same tiles — merge into one strip. */
export function shouldMergeHomeSections(productCount: number, distinctCategories: number): boolean {
  return productCount <= 24 || distinctCategories <= 8
}

export function mergeHomeGroupSections(
  rawSections: Array<{ group: HomeGroupDef; heroes: CategoryHero[] }>
): Array<{ group: HomeGroupDef; heroes: CategoryHero[] }> {
  const seen = new Set<string>()
  const merged: CategoryHero[] = []
  for (const s of rawSections) {
    for (const h of s.heroes) {
      if (!seen.has(h.category)) {
        seen.add(h.category)
        merged.push(h)
      }
    }
  }
  const browseGroup: HomeGroupDef = {
    id: 'browse-collection',
    label: 'Browse our collection',
    strategy: 'featured',
  }
  return merged.length ? [{ group: browseGroup, heroes: merged }] : []
}
