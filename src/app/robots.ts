import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin', '/api/', '/checkout/', '/checkout', '/account/', '/account'],
      },
    ],
    sitemap: 'https://lhestamall.com/sitemap.xml',
    host: 'https://lhestamall.com',
  }
}

