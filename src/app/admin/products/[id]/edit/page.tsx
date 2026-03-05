import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { EditProductForm } from './edit-product-form'

export default async function EditProductPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!product) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Update product information.
                    </p>
                </div>

                <EditProductForm product={product} />
            </div>
        </div>
    )
}
