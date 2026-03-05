'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, Clock, ArrowDown, ArrowUp, ArrowDownAZ } from 'lucide-react'
import { useState, useEffect } from 'react'

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name'

export function ShopFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const currentSort = searchParams.get('sort') || 'newest'
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''

  const [minPrice, setMinPrice] = useState(currentMinPrice)
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice)

  useEffect(() => {
    setMinPrice(currentMinPrice)
    setMaxPrice(currentMaxPrice)
  }, [currentMinPrice, currentMaxPrice])

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    router.push(`/shop?${params.toString()}`)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')
    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')
    router.push(`/shop?${params.toString()}`)
    setShowFilters(false)
  }

  const clearPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('minPrice')
    params.delete('maxPrice')
    setMinPrice('')
    setMaxPrice('')
    router.push(`/shop?${params.toString()}`)
  }

  const hasActiveFilters = !!currentMinPrice || !!currentMaxPrice

  const SortTypeIcon = () => {
    switch (currentSort) {
      case 'price-low': return <ArrowDown className="w-4 h-4 shrink-0 text-(--color-text)" aria-hidden />
      case 'price-high': return <ArrowUp className="w-4 h-4 shrink-0 text-(--color-text)" aria-hidden />
      case 'name': return <ArrowDownAZ className="w-4 h-4 shrink-0 text-(--color-text)" aria-hidden />
      default: return <Clock className="w-4 h-4 shrink-0 text-(--color-text)" aria-hidden />
    }
  }

  return (
    <div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 shrink-0 min-w-0 flex-1 sm:flex-initial">
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className={`inline-flex items-center justify-center gap-2 h-10 px-3 sm:px-4 rounded-md transition-colors text-body-sm font-semibold shrink-0 ${
          hasActiveFilters
            ? 'bg-(--color-header-bg) text-(--color-header-text)'
            : 'bg-(--color-surface) text-(--color-text) hover:bg-(--color-surface-hover)'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden />
        {hasActiveFilters ? 'Filters (Active)' : 'Filters'}
      </button>

      {/* Desktop: old version – Sort by + select */}
      <div className="hidden sm:flex items-center gap-2 shrink-0 h-10">
        <span className="text-body-sm text-(--color-text-muted) whitespace-nowrap">Sort by:</span>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="h-10 px-4 rounded-md bg-(--color-surface) ring-1 ring-inset ring-(--color-text)/10 text-body-sm font-medium text-(--color-text) focus:ring-2 focus:ring-(--color-link)/30 outline-none shrink-0"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>

      {/* Mobile: sort at far right – Sort by: + sort type icon */}
      <div className="flex-1 sm:hidden" aria-hidden />
      <label className="relative sm:hidden flex items-center gap-1.5 h-10 px-3 rounded-md bg-(--color-surface) ring-1 ring-inset ring-(--color-text)/10 cursor-pointer shrink-0 focus-within:ring-2 focus-within:ring-(--color-link)/30 focus-within:ring-inset">
        <span className="text-body-sm text-(--color-text-muted) whitespace-nowrap">Sort by:</span>
        <SortTypeIcon />
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          title="Sort by"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer min-w-0"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </label>

      {showFilters && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setShowFilters(false)} aria-hidden />
          <div
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-(--color-surface) shadow-xl ring-1 ring-(--color-text)/10 p-6 z-60 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-title text-(--color-text)">Filters</h3>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-md hover:bg-(--color-surface-hover) transition-colors text-(--color-text)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-label text-(--color-text-muted) mb-3">Price Range (GH₵)</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-body-sm text-(--color-text)">Minimum</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                      className="w-full h-10 px-4 rounded-md bg-(--color-bg) ring-1 ring-inset ring-(--color-text)/10 text-body-sm text-(--color-text) focus:ring-2 focus:ring-(--color-link)/30 focus:ring-inset outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-body-sm text-(--color-text)">Maximum</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="No limit"
                      className="w-full h-10 px-4 rounded-md bg-(--color-bg) ring-1 ring-inset ring-(--color-text)/10 text-body-sm text-(--color-text) focus:ring-2 focus:ring-(--color-link)/30 focus:ring-inset outline-none"
                    />
                  </div>
                  {(minPrice || maxPrice) && (
                    <p className="text-body-sm text-(--color-text-muted) bg-(--color-surface-hover) p-3 rounded-md">
                      {minPrice && `From GH₵ ${minPrice}`} {minPrice && maxPrice && ' – '} {maxPrice && `To GH₵ ${maxPrice}`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={clearPriceFilter}
                  className="flex-1 h-11 rounded-md bg-(--color-surface) text-body-sm font-semibold text-(--color-text) hover:bg-(--color-surface-hover) transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={applyPriceFilter}
                  className="flex-1 h-11 rounded-md bg-(--color-header-bg) text-(--color-header-text) text-body-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
