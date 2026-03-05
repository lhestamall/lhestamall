import { createClient } from '@/utils/supabase/server'
import { Package, TrendingUp, AlertCircle, ShoppingCart, Clock } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch product stats
    const { data: products } = await supabase.from('products').select('id, stock_quantity')

    // Fetch order stats (include payment_status for revenue)
    const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_status, created_at, shipping_address')
        .order('created_at', { ascending: false })

    const totalProducts = products?.length || 0
    const lowStockItems = products?.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length || 0
    const outOfStockItems = products?.filter(p => p.stock_quantity === 0).length || 0

    // Revenue: only count orders with successful payment and not cancelled (avoids double-count and reflects real income)
    const totalRevenue = orders?.filter(
        (o) => o.payment_status === 'success' && o.status !== 'cancelled'
    ).reduce((acc, order) => acc + Number(order.total_amount), 0) || 0
    const recentOrders = orders?.slice(0, 5) || []

    const stats = [
        {
            label: 'Total Products',
            value: totalProducts,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            label: 'Low Stock',
            value: lowStockItems,
            icon: AlertCircle,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            label: 'Total Revenue',
            value: `GH₵ ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        },
        {
            label: 'Total Orders',
            value: orders?.length || 0,
            icon: ShoppingCart,
            color: 'text-purple-600',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Welcome back to your store management center.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-3 ${stat.bg} ${stat.color} rounded-bl-2xl transition-transform group-hover:scale-110`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white leading-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Orders Table */}
                <div className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <ShoppingCart className="w-5 h-5 text-gray-400" />
                            Recent Orders
                        </h3>
                        <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-black dark:text-white hover:underline">View All</Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="text-sm text-gray-500 italic py-12 text-center border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-2xl flex-1 flex flex-col items-center justify-center gap-3">
                            <Clock className="w-8 h-8 text-gray-300" />
                            No recent orders to show.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                            {(order.shipping_address?.full_name?.[0] || 'G').toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold truncate max-w-[150px]">{order.shipping_address?.full_name || 'Guest'}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">#{order.id.split('-')[0]}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">GH₵ {Number(order.total_amount).toFixed(2)}</p>
                                        <p className={`text-[9px] font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'text-emerald-500' : 'text-yellow-500'}`}>{order.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions & Stock Alerts */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                            <Package className="w-5 h-5 text-gray-400" />
                            Quick Product Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/admin/products/new" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all group">
                                <Package className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Add New</span>
                            </Link>
                            <Link href="/admin/products" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all group">
                                <TrendingUp className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Inventory</span>
                            </Link>
                        </div>
                    </div>

                    {outOfStockItems > 0 && (
                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-900 dark:text-red-400">Inventory Alert</h4>
                                <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                                    You have {outOfStockItems} items currently out of stock. These items are hidden from your store.
                                </p>
                                <Link href="/admin/products" className="text-[10px] font-bold uppercase tracking-widest text-red-900 dark:text-red-400 mt-2 inline-block hover:underline">Restock Now</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
