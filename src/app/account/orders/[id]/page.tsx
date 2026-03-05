import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, CheckCircle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CustomerOrderDetailsPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id) // Ensure security: user can only see their own orders
        .single()

    if (orderError || !order) {
        notFound()
    }

    const { data: items } = await supabase
        .from('order_items')
        .select(`
            *,
            product:products(name, image_url)
        `)
        .eq('order_id', order.id)

    const getStatusStep = (status: string) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered']
        return steps.indexOf(status)
    }

    const currentStep = getStatusStep(order.status)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl space-y-8 animate-in fade-in duration-500">
                <Link
                    href="/account/orders"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to My Orders
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Receipt for Order</p>
                        <h1 className="text-3xl font-bold tracking-tight">#{order.id.split('-')[0].toUpperCase()}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-black dark:text-white bg-gray-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full text-[10px]">{order.status}</span>
                        </div>
                    </div>
                </div>

                {/* Tracking Progress */}
                <div className="p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 shadow-sm">
                    <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-zinc-900 -translate-y-1/2 -z-0" />
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-black dark:bg-white -translate-y-1/2 transition-all duration-1000"
                            style={{ width: `${(currentStep / 3) * 100}%` }}
                        />

                        {['Order Placed', 'Processing', 'On the Way', 'Delivered'].map((label, i) => (
                            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-950 transition-colors ${i <= currentStep ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-zinc-800 text-gray-400'}`}>
                                    {i <= currentStep ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-center absolute top-10 whitespace-nowrap">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Order Details */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-900 font-bold flex items-center gap-2">
                                <Package className="w-5 h-5 text-gray-400" />
                                Order Items
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-zinc-900">
                                {items?.map((item) => (
                                    <div key={item.id} className="px-6 py-6 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                                            <img
                                                src={item.product?.image_url}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{item.product?.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × GH₵ {item.price_at_purchase}</p>
                                            </div>
                                        </div>
                                        <div className="font-bold">
                                            GH₵ {(item.quantity * item.price_at_purchase).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-6 bg-gray-50/50 dark:bg-zinc-900/50 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>GH₵ {Number(order.total_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-zinc-800 font-bold text-xl">
                                    <span>Total Amount</span>
                                    <span>GH₵ {Number(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" />
                                    Delivery Address
                                </h3>
                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <p className="font-bold text-gray-900 dark:text-white">{order.shipping_address?.full_name}</p>
                                    <p>{order.shipping_address?.address}</p>
                                    <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip_code}</p>
                                    <p className="uppercase text-[10px] font-bold mt-2">{order.shipping_address?.country}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-zinc-900">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                                    <CreditCard className="w-3 h-3" />
                                    Payment Method
                                </h3>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-1 rounded bg-gray-100 dark:bg-zinc-800">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                            className="h-4"
                                            alt="MC"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <span className="font-medium">MasterCard **** 4422</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-black text-white shadow-xl space-y-4">
                            <h3 className="font-bold text-lg">Need help?</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">If you have any questions about your order, our dedicated premium support team is here for you 24/7.</p>
                            <button className="w-full h-12 rounded-xl bg-white text-black text-sm font-bold hover:opacity-90 transition-opacity">Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
