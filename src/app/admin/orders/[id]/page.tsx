import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Banknote, Smartphone } from 'lucide-react'
import { getProductImageUrl } from '@/lib/product'

export const dynamic = 'force-dynamic'

export default async function OrderDetailsPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const supabase = await createClient()

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .single()

    if (orderError || !order) {
        notFound()
    }

    const { data: items } = await supabase
        .from('order_items')
        .select(`
            *,
            product:products(name, image_url, image_urls)
        `)
        .eq('order_id', order.id)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Link
                href="/admin/orders"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Orders
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.split('-')[0].toUpperCase()}</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleString()}</span>
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-black dark:text-white bg-gray-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full text-[10px]">{order.status}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-bold hover:bg-gray-50 transition-colors">Print Receipt</button>
                    <button className="h-10 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity">Contact Customer</button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-900 font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            Items Purchased
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-zinc-900">
                            {items?.map((item) => (
                                <div key={item.id} className="px-6 py-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                                            <img
                                                src={item.product ? getProductImageUrl(item.product) : ''}
                                                alt={item.product?.name ?? ''}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{item.product?.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × GH₵ {item.price_at_purchase}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-lg">
                                        GH₵ {(item.quantity * item.price_at_purchase).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-6 bg-gray-50/50 dark:bg-zinc-900/50 space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>GH₵ {Number(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tax</span>
                                <span>GH₵ 0.00</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-zinc-800 font-bold text-xl">
                                <span>Total</span>
                                <span>GH₵ {Number(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer Details</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
                                    {(order.shipping_address?.full_name?.[0] || 'G').toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold">{order.shipping_address?.full_name || 'Guest'}</p>
                                    <p className="text-sm text-gray-500 truncate">Customer (see shipping)</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-zinc-900">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                Shipping Address
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <p className="font-bold text-gray-900 dark:text-white">{order.shipping_address?.full_name}</p>
                                <p>{order.shipping_address?.address}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip_code}</p>
                                <p className="uppercase text-[10px] font-bold mt-2">{order.shipping_address?.country}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-zinc-900">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <CreditCard className="w-3 h-3" />
                                Payment Method
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                                {order.payment_provider === 'pay_on_delivery' ? (
                                    <>
                                        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                                            <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <span className="font-medium">Pay on delivery</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                                            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span className="font-medium">Online (Paystack)</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
