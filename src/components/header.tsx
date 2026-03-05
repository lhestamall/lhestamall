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

  return (
    <>
    <header className="px-3 sm:px-4 lg:px-6 h-12 sm:h-14 flex items-center justify-between gap-3 sticky top-0 bg-(--color-header-bg) z-50 w-full">
      <Link className="flex items-center gap-2 shrink-0 min-w-0" href="/">
        <Logo variant="dark-bg" className="w-7 h-7 sm:w-8 sm:h-8 text-(--color-header-text) shrink-0 relative -top-[0.15em]" />
        <span className="text-(--color-header-text) font-semibold text-body-sm sm:text-title-sm whitespace-nowrap truncate">
          Lhesta Mall
        </span>
      </Link>

      <nav className="flex items-center gap-0 sm:gap-2 shrink-0">
        <Link
          className="hidden md:inline-flex text-body-sm font-medium text-(--color-header-text)/90 hover:text-(--color-header-text) px-2 py-1 rounded transition-colors"
          href="/"
        >
          Home
        </Link>
        <Link
          className="hidden md:inline-flex text-body-sm font-medium text-(--color-header-text)/90 hover:text-(--color-header-text) px-2 py-1 rounded transition-colors"
          href="/shop"
        >
          Shop
        </Link>

        <div className="hidden md:block relative ml-1 shrink-0">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="h-8 w-40 lg:w-52 pl-8 pr-3 rounded-md bg-(--color-surface) outline-none text-body-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:ring-2 focus:ring-(--color-link)/40"
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) pointer-events-none" />
          </form>
          {showSuggestions && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-(--color-surface) rounded-lg shadow-lg ring-1 ring-(--color-header-text)/15 py-2 z-100">
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

        {/* Mobile search icon (home, etc.) – sits before wishlist */}
        {!isShopPage && (
          <button
            type="button"
            onClick={() => {
              setMobileSearchExpanded(true)
              setMobileMenuOpen(false)
            }}
            className="md:hidden p-2 rounded-md text-(--color-header-text) hover:bg-white/10"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        <Link
          href="/account/wishlist"
          className="relative p-2 rounded-md text-(--color-header-text) hover:bg-white/10 transition-colors"
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
          className="relative p-2 rounded-md text-(--color-header-text) hover:bg-white/10 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-4.5 h-4.5 px-0.5 rounded-full bg-(--color-header-text) text-(--color-header-bg) text-[0.65rem] font-semibold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
        <div className="hidden md:block">
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 ml-1 group focus:outline-none rounded-md p-1 -m-1 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 text-(--color-header-text) flex items-center justify-center text-xs font-bold">
                {((user.user_metadata?.full_name as string)?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </div>
              <span className="text-sm font-medium truncate max-w-[140px] text-(--color-header-text)/90 group-hover:text-(--color-header-text)">
                Account
              </span>
            </Link>
          ) : (
            <Link
              className="ml-1 inline-flex items-center justify-center min-h-8 px-3 rounded-md bg-(--color-cta-bg) text-(--color-cta-text) text-body-sm font-semibold hover:opacity-90"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 rounded-md text-(--color-header-text) hover:bg-white/10"
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-(--color-text) hover:bg-(--color-surface-hover)"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 text-(--color-text-muted)" />
                Home
              </Link>
              <Link
                href="/shop"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-(--color-text) hover:bg-(--color-surface-hover)"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutGrid className="w-5 h-5 text-(--color-text-muted)" />
                Shop
              </Link>
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-(--color-text) hover:bg-(--color-surface-hover)"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-(--color-text) hover:bg-(--color-surface-hover) font-semibold"
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
                className="w-full h-11 pl-10 pr-4 rounded-(--radius-md) bg-(--color-surface) text-body-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-link)/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                autoFocus={mobileSearchExpanded}
              />
            </form>
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-(--color-surface) rounded-(--radius-md) shadow-lg ring-1 ring-(--color-text)/10 py-2 z-50 max-h-60 overflow-y-auto">
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
