import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { submitCheckout } from './actions'
import { ShieldCheck, Lock, ChevronLeft, Banknote, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { getProductImageUrl } from '@/lib/product'
import { SubmitButton } from '@/components/submit-button'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage(props: {
    searchParams: Promise<{ error?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const searchParams = await props.searchParams
    const checkoutError = searchParams.error

    // Fetch profile for shipping defaults
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch cart items
    const { data: cartItems } = await supabase
        .from('cart_items')
        .select(`
            *,
            product:products(*)
        `)
        .eq('user_id', user.id)

    if (!cartItems || cartItems.length === 0) {
        redirect('/shop')
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
            <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                <Link
                    href="/shop"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white mb-8 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to shopping
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-12">Checkout</h1>

                {checkoutError && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium">
                        {checkoutError}
                    </div>
                )}

                <form action={submitCheckout} className="grid gap-12 lg:grid-cols-3">
                    {/* Shipping and Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Info */}
                        <div className="p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 shadow-sm space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                Shipping Information
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                                    <input
                                        name="full_name"
                                        defaultValue={profile?.full_name || ''}
                                        required
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Address</label>
                                    <input
                                        name="address"
                                        defaultValue={profile?.address || ''}
                                        required
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">City</label>
                                    <input
                                        name="city"
                                        defaultValue={profile?.city || ''}
                                        required
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">State / Province</label>
                                    <input
                                        name="state"
                                        defaultValue={profile?.state || ''}
                                        required
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Zip Code</label>
                                    <input
                                        name="zip_code"
                                        defaultValue={profile?.zip_code || ''}
                                        required
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Country</label>
                                    <input
                                        name="country"
                                        defaultValue={profile?.country || ''}
                                        required
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment method */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                <CreditCard className="w-5 h-5 text-gray-500" />
                                Payment method
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 cursor-pointer has-[:checked]:border-black dark:has-[:checked]:border-white has-[:checked]:bg-gray-50 dark:has-[:checked]:bg-zinc-900 transition-colors">
                                    <input type="radio" name="payment_method" value="paystack" defaultChecked className="w-4 h-4 text-black focus:ring-black" />
                                    <span className="flex items-center gap-2 font-medium">
                                        <CreditCard className="w-4 h-4 text-emerald-500" />
                                        Pay online (Paystack)
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 cursor-pointer has-[:checked]:border-black dark:has-[:checked]:border-white has-[:checked]:bg-gray-50 dark:has-[:checked]:bg-zinc-900 transition-colors">
                                    <input type="radio" name="payment_method" value="pay_on_delivery" className="w-4 h-4 text-black focus:ring-black" />
                                    <span className="flex items-center gap-2 font-medium">
                                        <Banknote className="w-4 h-4 text-amber-500" />
                                        Pay on delivery
                                    </span>
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Choose to pay now with card via Paystack, or pay when your order is delivered.
                            </p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-8">
                        <div className="p-8 rounded-2xl bg-black text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Lock className="w-24 h-24" />
                            </div>

                            <h2 className="text-xl font-bold mb-8">Summary</h2>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar mb-8 pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 shrink-0">
                                                <img
                                                    src={getProductImageUrl(item.product)}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold truncate">{item.product.name}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold">GH₵ {(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>GH₵ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-4">
                                    <span>Total</span>
                                    <span>GH₵ {subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <SubmitButton
                                className="w-full h-16 mt-8 rounded-2xl bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                loadingText="Placing order…"
                            >
                                <Lock className="w-4 h-4 shrink-0" />
                                Place Order
                            </SubmitButton>

                            <p className="text-[10px] text-gray-500 text-center mt-6 uppercase tracking-widest font-bold">
                                Guaranteed Safe & Secure Checkout
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
