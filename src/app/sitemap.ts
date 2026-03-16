import type { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const urls: MetadataRoute.Sitemap = [
    { url: 'https://lhestamall.com/', changeFrequency: 'daily', priority: 1 },
    { url: 'https://lhestamall.com/shop', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://lhestamall.com/account', changeFrequency: 'monthly', priority: 0.4 },
  ]

  try {
    const { data: products } = await supabase.from('products').select('id, updated_at').order('updated_at', { ascending: false })
    for (const p of products ?? []) {
      urls.push({
        url: `https://lhestamall.com/shop/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  } catch {
    // If the table is missing or Supabase fails, just return the static URLs.
  }

  return urls
}

