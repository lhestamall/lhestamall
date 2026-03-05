import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Package, Clock, CheckCircle, Truck, XCircle, Search, Eye } from 'lucide-react'
import { OrderStatusSelect } from './OrderStatusSelect'

export const dynamic = 'force-dynamic'

type OrderRow = {
    id: string
    total_amount: number
    status: string
    created_at: string
    shipping_address: { full_name?: string } | null
    payment_provider?: string | null
    order_items?: Array<{ id: string; quantity: number; price_at_purchase: number; product: { id: number; name: string } | null }>
}

/** Supabase can return nested product as object or array; normalize to OrderRow[]. */
function normalizeOrders(rows: unknown): OrderRow[] | null {
    if (!Array.isArray(rows)) return null
    return rows.map((order: any) => ({
        ...order,
        order_items: Array.isArray(order?.order_items)
            ? order.order_items.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                price_at_purchase: item.price_at_purchase,
                product: Array.isArray(item.product) ? (item.product[0] ?? null) : item.product ?? null,
            }))
            : undefined,
    })) as OrderRow[]
}

function filterOrdersBySearch(orders: OrderRow[] | null, q: string): OrderRow[] {
    if (!orders || orders.length === 0) return []
    if (!q || q.trim() === '') return orders
    const term = q.trim().toLowerCase()
    const termNum = parseInt(term, 10)
    return orders.filter((order) => {
        if (order.id.toLowerCase().includes(term)) return true
        const name = order.shipping_address?.full_name?.toLowerCase() ?? ''
        if (name.includes(term)) return true
        const items = order.order_items ?? []
        for (const item of items) {
            const p = item.product
            if (p?.name?.toLowerCase().includes(term)) return true
            if (!isNaN(termNum) && p?.id === termNum) return true
        }
        return false
    })
}

export default async function AdminOrdersPage(props: { searchParams: Promise<{ q?: string }> }) {
    const searchParams = await props.searchParams
    const q = typeof searchParams.q === 'string' ? searchParams.q : ''
    const supabase = await createClient()

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            id,
            total_amount,
            status,
            created_at,
            shipping_address,
            payment_provider,
            order_items (
                id,
                quantity,
                price_at_purchase,
                product:products(id, name)
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return (
            <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                <h2 className="text-lg font-bold mb-2">Error Loading Orders</h2>
                <p className="font-mono text-sm">Message: {error.message}</p>
                <p className="font-mono text-sm">Code: {error.code}</p>
                <p className="font-mono text-sm mt-4 italic">Check your Supabase SQL Editor to ensure the orders table exists and RLS allows select.</p>
            </div>
        )
    }

    const normalizedOrders = normalizeOrders(orders)
    const filteredOrders = filterOrdersBySearch(normalizedOrders, q)

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
            case 'pending': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20'
            case 'processing': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20'
            case 'shipped': return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20'
            case 'delivered': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20'
            case 'cancelled': return 'bg-red-50 text-red-700 dark:bg-red-900/20'
            default: return 'bg-gray-50 text-gray-700'
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Order Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage all customer purchases.</p>
                </div>
                <form method="get" action="/admin/orders" className="relative">
                    <input
                        type="search"
                        name="q"
                        defaultValue={q}
                        placeholder="Search by order ID, customer, product name or ID..."
                        className="h-10 w-72 sm:w-80 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </form>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-900">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                                            {q ? 'No orders match your search.' : 'No orders yet.'}
                                        </p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500">
                                            {q ? 'Try a different search.' : 'When customers place orders, they’ll appear here.'}
                                        </p>
                                        {!q && (
                                            <Link href="/admin" className="inline-block mt-4 text-sm font-bold text-black dark:text-white hover:underline">
                                                Back to dashboard
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                                            #{order.id.split('-')[0].toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const name = order.shipping_address?.full_name || 'Guest'
                                                const initial = (name[0] || 'G').toUpperCase()
                                                return (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                                                            {initial}
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-[140px]">{name}</span>
                                                    </div>
                                                )
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-[200px]">
                                            {(() => {
                                                const items = order.order_items ?? []
                                                const names = items.map((i) => i.product?.name).filter(Boolean) as string[]
                                                return names.length ? (
                                                    <span className="line-clamp-2" title={names.join(', ')}>{names.join(', ')}</span>
                                                ) : (
                                                    <span className="italic text-gray-400">—</span>
                                                )
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            GH₵ {Number(order.total_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBg(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group/view"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-400 group-hover/view:text-black dark:group-hover/view:text-white" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
