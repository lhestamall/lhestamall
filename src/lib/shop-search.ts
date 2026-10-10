/**
 * Build Supabase `.or()` filter for name/description ILIKE search.
 * PostgREST splits OR operands on commas — values with commas must be double-quoted.
 * ILIKE treats % and _ as wildcards — escape them for literal matches.
 */
export function buildProductSearchOrFilter(raw: string): string {
  const q = raw.trim()
  if (!q) return ''

  // Escape for ILIKE: \ % _
  let escaped = q.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  // Double-quote for PostgREST so commas inside the search don't break `or=(a,b)`
  escaped = escaped.replace(/"/g, '\\"')
  const pattern = `"%${escaped}%"`

  return `name.ilike.${pattern},description.ilike.${pattern}`
}
