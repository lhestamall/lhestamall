import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ShoppingBag, Heart, Settings, User } from 'lucide-react'
import { AccountProfileForm } from '@/components/account-profile-form'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, address, city, state, zip_code, country')
    .eq('id', user.id)
    .single()

  let ordersCount: number | null = null
  let wishlistCount: number | null = null
  try {
    const [ordersRes, wishlistRes] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('wishlist_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ])
    ordersCount = ordersRes.count ?? null
    wishlistCount = wishlistRes.count ?? null
  } catch {
    // Tables may not exist or RLS may deny; show 0
  }

  const name = profile?.full_name?.trim() || user.email?.split('@')[0] || 'there'
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="flex flex-col min-h-screen bg-(--color-bg) text-(--color-text)">
      <main className="flex-1">
        <div className="ds-container py-5 sm:py-8">
          {/* Mobile: no card, flowing sections. Desktop: single card */}
          <div className="flex flex-col gap-5 sm:max-w-lg sm:mx-auto sm:bg-(--color-surface) sm:rounded-lg sm:p-6 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-(--color-surface-hover) flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-(--color-text-muted)" aria-hidden />
              </div>
              <div className="min-w-0 flex flex-col gap-0.5">
                <span className="text-body-sm text-(--color-text-muted)/80">
                  Welcome back
                </span>
                <h1 className="text-heading text-(--color-text)">
                  {name}
                </h1>
                <p className="text-body-sm text-(--color-text-muted) mt-0.5">
                  Manage your orders and saved items
                </p>
              </div>
            </div>

            <nav className="space-y-2" aria-label="Account navigation">
              <Link
                href="/account/orders"
                className="flex items-center justify-between gap-3 w-full py-3 px-4 rounded-md bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-(--color-text-muted) group-hover:text-(--color-link)" aria-hidden />
                  <span className="text-body-sm font-medium text-(--color-text)">My Orders</span>
                  {typeof ordersCount === 'number' && ordersCount > 0 && (
                    <span className="text-label text-(--color-text-muted)">
                      {ordersCount} order{ordersCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </span>
                <ChevronRight className="w-5 h-5 text-(--color-text-muted) shrink-0" aria-hidden />
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center justify-between gap-3 w-full py-3 px-4 rounded-md bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-(--color-text-muted) group-hover:text-(--color-link)" aria-hidden />
                  <span className="text-body-sm font-medium text-(--color-text)">Wishlist</span>
                  {typeof wishlistCount === 'number' && wishlistCount > 0 && (
                    <span className="text-label text-(--color-text-muted)">
                      {wishlistCount} item{wishlistCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </span>
                <ChevronRight className="w-5 h-5 text-(--color-text-muted) shrink-0" aria-hidden />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between gap-3 w-full py-3 px-4 rounded-md bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors group"
                >
                  <span className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-(--color-text-muted) group-hover:text-(--color-link)" aria-hidden />
                    <span className="text-body-sm font-medium text-(--color-text)">Admin Panel</span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-(--color-text-muted) shrink-0" aria-hidden />
                </Link>
              )}
            </nav>

            <div>
              <AccountProfileForm profile={profile} />
            </div>

            <p className="text-label text-(--color-text-muted)">
              Signed in as <span className="font-medium text-(--color-text)">{user.email}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
