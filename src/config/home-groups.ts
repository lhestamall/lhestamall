/**
 * Home page groups: each group shows categories (not raw products).
 * Categories are represented by a hero image (best/eye-catching product in that category).
 * Not every category appears in every group; membership is derived by strategy or optional whitelist.
 */

export type HomeGroupStrategy =
  | 'new_arrivals'   // Categories with products created since a cutoff date (e.g. last 30 days)
  | 'pre_order'      // Categories that have at least one pre-order product
  | 'best_selling'   // Categories by total quantity sold (order_items)
  | 'trending'       // Categories by quantity sold in recent period (e.g. last 30 days)
  | 'featured'       // Fallback: categories with most products
  | 'deals'          // Placeholder: no discount data yet

export type HomeGroupDef = {
  id: string
  label: string
  strategy: HomeGroupStrategy
  categoryWhitelist?: string[]
}

/** New arrivals: products created within this many days. */
export const NEW_ARRIVALS_DAYS = 30

/** Trending: orders from this many days ago until now. */
export const TRENDING_DAYS = 30

/** All home groups in display order. Pre-order first as the most important. */
export const HOME_GROUPS: HomeGroupDef[] = [
  { id: 'pre_order', label: 'Pre-order', strategy: 'pre_order' },
  { id: 'new_arrivals', label: 'New Arrivals', strategy: 'new_arrivals' },
  { id: 'best_selling', label: 'Best Selling', strategy: 'best_selling' },
  { id: 'trending', label: 'Trending', strategy: 'trending' },
  { id: 'deals', label: 'Deals', strategy: 'deals' },
]

/** Max categories to show per group on the home page. */
export const HOME_GROUP_CATEGORY_LIMIT = 8
