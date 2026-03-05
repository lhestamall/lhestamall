'use client'

import type { User } from '@supabase/supabase-js'
import { UserProvider } from '@/context/user-context'
import { ToastProvider } from '@/context/toast-context'
import { WishlistProvider } from '@/context/wishlist-context'
import { CartProvider } from '@/context/cart-context'

export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser?: User | null
}) {
  return (
    <UserProvider initialUser={initialUser}>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </UserProvider>
  )
}
