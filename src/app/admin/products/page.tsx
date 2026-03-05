import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ProductTable } from './ProductTable'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const supabase = await createClient()

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Inventory</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage your catalog, stock levels, and pricing.
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-6 py-3 text-sm font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-black"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Product
                </Link>
            </div>

            <ProductTable products={products || []} />
        </div>
    )
}
