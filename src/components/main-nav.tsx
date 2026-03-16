'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export function MainNav() {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)
      .then(({ data }) => {
        const list = Array.from(new Set((data ?? []).map((p) => p.category as string).filter(Boolean)))
        setCategories(list)
      })
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    ...categories.map((cat) => ({ href: `/shop?category=${encodeURIComponent(cat)}`, label: cat })),
  ]

  return (
    <nav className="bg-(--color-nav-bg) text-(--color-nav-text) sticky top-12 sm:top-14 z-40">
      <div className="overflow-x-auto no-scrollbar w-full">
        <div className="flex items-center gap-1 py-2 min-w-max px-4 sm:px-6 lg:px-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href + label}
              href={href}
              className="shrink-0 px-4 py-2.5 text-body-sm font-medium hover:bg-(--color-nav-hover) rounded-sm transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
