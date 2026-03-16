import Link from 'next/link'
import { Logo } from './logo'

const WHATSAPP_NUMBER = '233536193844'
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}`

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-(--color-surface) mt-auto">
      <div className="ds-container py-12 sm:py-16">
        {/* Mobile: vertical list, centered. Desktop: 4-column grid. */}
        <div className="flex flex-col items-center text-center gap-10 lg:grid lg:grid-cols-4 lg:gap-8 lg:items-start lg:text-left">
          {/* 1. Title + explanation */}
          <div className="space-y-5 flex flex-col items-center lg:items-start">
            <Link href="/" className="w-fit text-(--color-text) hover:opacity-80 transition-opacity" aria-label="Lhesta Mall – Home">
              <Logo className="h-12 w-auto sm:h-14" showTagline />
            </Link>
            <p className="text-body-sm text-(--color-text-muted) max-w-xs">
              A curated selection of artisanal goods and high-quality essentials for the modern lifestyle.
            </p>
          </div>

          {/* 2. Support */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-label text-(--color-text-muted) mb-4">Support</h4>
            <ul className="space-y-3 flex flex-col items-center lg:items-start">
              {['Shipping Policy', 'Returns & Exchanges', 'FAQs', 'Contact Us'].map((label) => (
                <li key={label}>
                  <Link href="#" className="text-body-sm text-(--color-text-muted) hover:text-(--color-text) transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Navigation */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-label text-(--color-text-muted) mb-4">Navigation</h4>
            <ul className="space-y-3 flex flex-col items-center lg:items-start">
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/shop', label: 'Categories' },
                { href: '/shop', label: 'New Arrivals' },
                { href: '/account/orders', label: 'Track Order' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-body-sm text-(--color-text-muted) hover:text-(--color-text) transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Get in Touch */}
          <div className="flex flex-col items-center lg:items-start w-full max-w-sm lg:max-w-none">
            <h4 className="text-label text-(--color-text-muted) mb-4">Get in Touch</h4>
            <ul className="space-y-4 w-full flex flex-col items-center lg:items-stretch" role="list">
              <li className="space-y-0.5 min-w-0 text-center sm:text-left">
                <p className="text-label text-(--color-text-muted)">Email</p>
                <a href="mailto:lhestamall@gmail.com" className="text-body-sm text-(--color-text) break-all hover:underline">
                  lhestamall@gmail.com
                </a>
              </li>
              <li className="space-y-0.5 min-w-0 text-center sm:text-left">
                <p className="text-label text-(--color-text-muted)">Location</p>
                <p className="text-body-sm text-(--color-text)">Accra, Ghana</p>
              </li>
              <li className="space-y-0.5 min-w-0 text-center sm:text-left">
                <p className="text-label text-(--color-text-muted)">WhatsApp</p>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm font-medium text-(--color-text) hover:underline"
                  aria-label="Chat on WhatsApp"
                >
                  +233 53 619 3844
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col items-center text-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <p className="text-body-sm text-(--color-text-muted)">© {currentYear} Lhesta Mall. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="text-body-sm text-(--color-text-muted) hover:text-(--color-text) transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-body-sm text-(--color-text-muted) hover:text-(--color-text) transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
