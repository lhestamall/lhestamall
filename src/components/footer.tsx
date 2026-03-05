import Link from 'next/link'
import { Logo } from './logo'
import { Mail, MapPin } from 'lucide-react'

const WHATSAPP_NUMBER = '233536193844'
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}`

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-(--color-surface) mt-auto">
      <div className="ds-container py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-8">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit text-(--color-text) hover:opacity-80 transition-opacity">
              <Logo className="w-8 h-8" />
              <span className="text-title-sm">Lhesta Mall</span>
            </Link>
            <p className="text-body-sm text-(--color-text-muted) max-w-xs">
              A curated selection of artisanal goods and high-quality essentials for the modern lifestyle.
            </p>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 p-2 rounded-md bg-(--color-bg) text-[#25D366] hover:opacity-90 transition-opacity"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span className="text-body-sm font-medium text-(--color-text)">+233 53 619 3844</span>
            </a>
          </div>

          <div>
            <h4 className="text-label text-(--color-text-muted) mb-4">Navigation</h4>
            <ul className="space-y-3">
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

          <div>
            <h4 className="text-label text-(--color-text-muted) mb-4">Support</h4>
            <ul className="space-y-3">
              {['Shipping Policy', 'Returns & Exchanges', 'FAQs', 'Contact Us'].map((label) => (
                <li key={label}>
                  <Link href="#" className="text-body-sm text-(--color-text-muted) hover:text-(--color-text) transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-(--color-text-muted) mb-4">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-(--color-bg) ring-1 ring-(--color-text)/10">
                  <Mail className="w-4 h-4 text-(--color-text-muted)" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-label text-(--color-text-muted)">Email</p>
                  <p className="text-body-sm text-(--color-text)">lhestamall@gmail.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-(--color-bg) ring-1 ring-(--color-text)/10">
                  <MapPin className="w-4 h-4 text-(--color-text-muted)" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-label text-(--color-text-muted)">Location</p>
                  <p className="text-body-sm text-(--color-text)">Accra, Ghana</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-body-sm text-(--color-text-muted)">© {currentYear} Lhesta Mall. All rights reserved.</p>
          <div className="flex gap-6">
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
