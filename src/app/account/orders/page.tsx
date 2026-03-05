import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MyOrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
            case 'processing': return <Package className="w-4 h-4 text-blue-500" />
            case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />
            case 'delivered': return <CheckCircle className="w-4 h-4 text-emerald-500" />
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />
            default: return null
        }
    }

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10'
            case 'processing': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/10'
            case 'shipped': return 'bg-purple-50 text-purple-700 dark:bg-purple-900/10'
            case 'delivered': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/10'
            case 'cancelled': return 'bg-red-50 text-red-700 dark:bg-red-900/10'
            default: return 'bg-gray-50 text-gray-700'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">My Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and track your purchase history.</p>
                </div>

                <div className="space-y-6">
                    {!orders || orders.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-900 shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
                            <p className="text-gray-500 mb-8">When you buy something, it will appear here.</p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold hover:scale-[1.02] transition-transform shadow-xl"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="block group p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-900 shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-gray-400">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Order #{order.id.split('-')[0].toUpperCase()}</p>
                                            <p className="text-lg font-bold">GH₵ {Number(order.total_amount).toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()} • {order.items?.[0]?.count || 0} items</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBg(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
