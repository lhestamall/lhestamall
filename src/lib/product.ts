export function getProductImageUrl(product: { image_url?: string | null; image_urls?: string[] | null }): string {
  const urls = product.image_urls
  if (Array.isArray(urls) && urls.length > 0) return urls[0]
  return product.image_url ?? ''
}

export function getProductImageUrls(product: { image_url?: string | null; image_urls?: string[] | null }): string[] {
  const urls = product.image_urls
  if (Array.isArray(urls) && urls.length > 0) return urls
  const single = product.image_url
  return single ? [single] : []
}
