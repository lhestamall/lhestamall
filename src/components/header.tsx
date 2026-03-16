'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Heart, Home, LayoutGrid, Menu, X } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import { createClient } from '@/utils/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/context/user-context'

import { Logo } from '@/components/logo'

export function Header() {
  const { totalItems, setIsCartOpen } = useCart()
  const { totalCount: wishlistCount } = useWishlist()
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{ id?: number; name: string; type: 'product' | 'category' }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const isShopPage = pathname.startsWith('/shop')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowSuggestions(false)
      setMobileMenuOpen(false)
      setMobileSearchExpanded(false)
    }
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([])
        return
      }
      const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${searchQuery}%`)
        .limit(5)
      const { data: categoryData } = await supabase
        .from('products')
        .select('category')
        .ilike('category', `%${searchQuery}%`)
      const uniqueCategories = Array.from(new Set(categoryData?.map((p) => p.category)))
        .filter(Boolean)
        .slice(0, 3)
      const formattedSuggestions: { id?: number; name: string; type: 'product' | 'category' }[] = [
        ...uniqueCategories.map((cat) => ({ name: cat as string, type: 'category' as const })),
        ...(products?.map((p) => ({ id: p.id, name: p.name, type: 'product' as const })) || []),
      ]
      setSuggestions(formattedSuggestions)
    }
    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const WHATSAPP_HREF = 'https://wa.me/233536193844'

  return (
    <>
    <header className="px-3 sm:px-4 lg:px-6 min-h-12 sm:min-h-14 py-2 flex items-center justify-between gap-3 sticky top-0 bg-(--color-header-bg) z-50 w-full">
      <Link className="flex items-center shrink-0 min-w-0" href="/" aria-label="Lhesta Mall – Home">
        <Logo variant="dark-bg" className="h-10 w-auto sm:h-12 shrink-0" showTagline />
      </Link>

      <div className="hidden md:flex items-center gap-3 flex-1 justify-end min-w-0 relative">
        <form onSubmit={handleSearch} className="relative w-56 sm:w-64 lg:w-72 shrink-0">
          <input
            type="text"
            placeholder="Search products"
            className="h-9 w-full pl-9 pr-3 rounded-sm bg-(--color-surface-hover) border border-(--color-border) outline-none text-body-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:ring-2 focus:ring-(--color-link)/40 focus:border-(--color-link)/50"
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) pointer-events-none" />
        </form>
        {showSuggestions && searchQuery.trim().length >= 2 && (
          <div className="absolute top-full right-0 mt-1 w-72 max-w-[calc(100vw-2rem)] bg-(--color-surface) rounded-sm shadow-lg ring-1 ring-(--color-header-text)/15 py-2 z-[100]">
            {suggestions.length > 0 ? (
              <div className="space-y-0.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (s.type === 'category') {
                        router.push(`/shop?category=${encodeURIComponent(s.name)}`)
                      } else {
                        router.push(`/shop/${s.id}`)
                      }
                      setSearchQuery('')
                      setShowSuggestions(false)
                    }}
                    className="w-full h-9 px-3 flex items-center justify-between text-left hover:bg-(--color-surface-hover) text-body-sm"
                  >
                    <span className="text-(--color-text) truncate max-w-[140px]">{s.name}</span>
                    <span className="text-label text-(--color-text-muted) shrink-0">{s.type}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-body-sm text-(--color-text-muted)">No results</div>
            )}
          </div>
        )}
      </div>
      {showSuggestions && (
        <div className="fixed inset-0 z-90" onClick={() => setShowSuggestions(false)} aria-hidden />
      )}

      <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile search icon (home, etc.) – sits before wishlist */}
        {!isShopPage && (
          <button
            type="button"
            onClick={() => {
              setMobileSearchExpanded(true)
              setMobileMenuOpen(false)
            }}
            className="md:hidden p-2 rounded-sm text-(--color-header-text) hover:bg-white/10"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        <Link
          href="/account/wishlist"
          className="relative p-2 rounded-sm text-(--color-header-text) hover:bg-white/10 transition-colors"
          title="Wishlist"
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-4.5 h-4.5 px-0.5 rounded-full bg-(--color-header-text) text-(--color-header-bg) text-[0.65rem] font-semibold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 rounded-sm text-(--color-header-text) hover:bg-white/10 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-4.5 h-4.5 px-0.5 rounded-full bg-(--color-header-text) text-(--color-header-bg) text-[0.65rem] font-semibold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link
              href="/account"
              className="inline-flex items-center justify-center min-h-9 px-4 rounded-sm bg-(--color-cta-bg) text-(--color-cta-text) text-body-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Account
            </Link>
          ) : (
            <Link
              className="inline-flex items-center justify-center min-h-9 px-4 rounded-sm bg-(--color-cta-bg) text-(--color-cta-text) text-body-sm font-semibold hover:opacity-90 transition-opacity"
              href="/login"
            >
              Login
            </Link>
          )}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-9 px-3 rounded-sm bg-[#25d366] text-white text-body-sm font-medium hover:opacity-90 transition-opacity"
            aria-label="Chat with LhestaMall on WhatsApp"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden lg:inline">Chat with LhestaMall</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 rounded-sm text-(--color-header-text) hover:bg-white/10"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </nav>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-90 md:hidden" onClick={() => setMobileMenuOpen(false)} aria-hidden />
          <div className="absolute top-full left-0 right-0 bg-(--color-surface) shadow-lg z-95 md:hidden">
            <div className="p-3 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-(--color-text) hover:bg-(--color-surface-hover)"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 text-(--color-text-muted)" />
                Home
              </Link>
              <Link
                href="/shop"
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-(--color-text) hover:bg-(--color-surface-hover)"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutGrid className="w-5 h-5 text-(--color-text-muted)" />
                Shop
              </Link>
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-(--color-text) hover:bg-(--color-surface-hover)"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-(--color-text) hover:bg-(--color-surface-hover) font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>

      {/* Mobile search: part of page flow below header, not inside it. Shop = always; home = when icon tapped. */}
      {(isShopPage || mobileSearchExpanded) && (
        <div className="md:hidden w-full bg-(--color-bg) border-b border-(--color-border)/50 relative">
          <div className="ds-container py-3 relative">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) pointer-events-none" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full h-11 pl-10 pr-4 rounded-sm bg-(--color-surface) text-body-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-link)/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                autoFocus={mobileSearchExpanded}
              />
            </form>
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-(--color-surface) rounded-sm shadow-lg ring-1 ring-(--color-text)/10 py-2 z-50 max-h-60 overflow-y-auto">
                {suggestions.length > 0 ? (
                  <div className="space-y-0.5">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (s.type === 'category') {
                            router.push(`/shop?category=${encodeURIComponent(s.name)}`)
                          } else {
                            router.push(`/shop/${s.id}`)
                          }
                          setSearchQuery('')
                          setShowSuggestions(false)
                          setMobileSearchExpanded(false)
                        }}
                        className="w-full h-11 px-4 flex items-center justify-between text-left hover:bg-(--color-surface-hover) text-body-sm"
                      >
                        <span className="text-(--color-text) truncate">{s.name}</span>
                        <span className="text-label text-(--color-text-muted) shrink-0">{s.type}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-body-sm text-(--color-text-muted)">No results</div>
                )}
              </div>
            )}
          </div>
          {showSuggestions && (
            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowSuggestions(false)} aria-hidden />
          )}
        </div>
      )}
    </>
  )
}
