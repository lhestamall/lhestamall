'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type WishlistItem = {
  id: string
  product_id: number
  product: {
    id: number
    name: string
    price: number
    image_url: string | null
    image_urls?: string[] | null
    is_pre_order?: boolean
    pre_order_release_date?: string | null
    stock_quantity: number
    category?: string | null
  }
}

type WishlistContextType = {
  items: WishlistItem[]
  isLoading: boolean
  addItem: (productId: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  isInWishlist: (productId: number) => boolean
  totalCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const fetchWishlist = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setItems([])
      setIsLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        product_id,
        product:products(id, name, price, image_url, image_urls, is_pre_order, pre_order_release_date, stock_quantity, category)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) setItems((data as unknown) as WishlistItem[] || [])
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const addItem = async (productId: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    const { error } = await supabase
      .from('wishlist_items')
      .upsert({ user_id: user.id, product_id: productId }, { onConflict: 'user_id,product_id', ignoreDuplicates: true })
    if (!error) await fetchWishlist()
  }

  const removeItem = async (productId: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
    await fetchWishlist()
  }

  const isInWishlist = (productId: number) => items.some((i) => i.product_id === productId)

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        removeItem,
        isInWishlist,
        totalCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (ctx === undefined) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
