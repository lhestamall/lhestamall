import { createClient } from '@/utils/supabase/server'
import { User, Mail, MapPin, Calendar, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
    const supabase = await createClient()

    // Fetch all profiles
    // We'll calculate order counts separately or through a simplified view if the relationship join fails
    const { data: customers, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })

    if (error) {
        return (
            <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                <h2 className="text-lg font-bold mb-2">Error Loading Customers</h2>
                <p className="font-mono text-sm">Message: {error.message}</p>
                <p className="font-mono text-sm">Code: {error.code}</p>
                <p className="mt-4 text-sm">
                    This error usually means your database is out of sync with your code.
                    Please run the fix-it SQL provided by the assistant!
                </p>
            </div>
        )
    }

    // Secondary fetch for order counts to avoid relationship join errors while debugging
    // In a real production app, we would use a proper joined query once the relationship is established
    const { data: orderCounts } = await supabase
        .from('orders')
        .select('user_id')

    const countsMap = orderCounts?.reduce((acc: any, order) => {
        if (order.user_id) acc[order.user_id] = (acc[order.user_id] || 0) + 1
        return acc
    }, {}) || {}

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Customer Directory</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and view your registered user base.</p>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-900">
                            {!customers || customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        No customers registered yet.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold">
                                                    {(customer.full_name?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{customer.full_name || 'Anonymous'}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono text-xs">ID: {customer.id.split('-')[0].toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <MapPin className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs">{customer.city ? `${customer.city}, ${customer.country || ''}` : 'No address set'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs">{new Date(customer.created_at || customer.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <ShoppingBag className="w-3 h-3 text-gray-400" />
                                                <span className="font-bold">{countsMap[customer.id] || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${customer.role === 'admin' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' : 'bg-gray-100 text-gray-600 dark:bg-zinc-900'}`}>
                                                {customer.role}
                                            </span>
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
