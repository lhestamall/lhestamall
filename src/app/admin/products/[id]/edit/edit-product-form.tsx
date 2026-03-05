'use client'

import { useState } from 'react'
import { updateProduct } from '../../actions'
import { ProductImagesUpload } from '@/components/product-images-upload'
import { SizeSelector } from '@/components/size-selector'
import { ColorListEditor } from '@/components/color-list-editor'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/toast-context'

type Product = {
    id: number
    name: string
    description: string
    price: number
    stock_quantity: number
    category: string
    image_url: string | null
    image_urls?: string[] | null
    sizes?: string[] | null
    colors?: string[] | null
    is_pre_order?: boolean | null
    pre_order_release_date?: string | null
}

export function EditProductForm({ product }: { product: Product }) {
    const [imageUrls, setImageUrls] = useState<string[]>(
        Array.isArray(product.image_urls) && product.image_urls.length > 0 ? product.image_urls : product.image_url ? [product.image_url] : []
    )
    const [sizes, setSizes] = useState<string[]>(Array.isArray(product.sizes) ? product.sizes : [])
    const [colors, setColors] = useState<string[]>(Array.isArray(product.colors) ? product.colors : [])
    const [isPreOrder, setIsPreOrder] = useState(Boolean(product.is_pre_order))
    const [preOrderReleaseDate, setPreOrderReleaseDate] = useState(product.pre_order_release_date ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        formData.append('imageUrls', JSON.stringify(imageUrls))
        formData.append('sizes', JSON.stringify(sizes))
        formData.append('colors', JSON.stringify(colors))
        formData.append('is_pre_order', isPreOrder ? 'true' : 'false')
        if (preOrderReleaseDate) formData.append('pre_order_release_date', preOrderReleaseDate)
        formData.append('id', product.id.toString())

        try {
            await updateProduct(formData)
            toast('Product updated successfully!', 'success')
            // Don't manually redirect - the server action handles it
        } catch (error: any) {
            // Next.js redirects throw a special error - don't treat it as an error
            if (error?.message?.includes('NEXT_REDIRECT')) {
                toast('Product updated successfully!', 'success')
                return
            }
            console.error('Update product error:', error)
            toast(error?.message || 'Failed to update product', 'error')
            setIsSubmitting(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            <div className="space-y-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm">
                <ProductImagesUpload imageUrls={imageUrls} onImageUrlsChange={setImageUrls} />

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        Product Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        required
                        defaultValue={product.name}
                        className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        defaultValue={product.description}
                        className="flex w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">
                            Price (GH₵)
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            defaultValue={product.price}
                            className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="stock" className="text-sm font-medium">
                            Stock
                        </label>
                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            min="0"
                            required
                            defaultValue={product.stock_quantity}
                            className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                        Category
                    </label>
                    <input
                        id="category"
                        name="category"
                        required
                        defaultValue={product.category}
                        className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                </div>

                <SizeSelector sizes={sizes} onChange={setSizes} />
                <ColorListEditor colors={colors} onChange={setColors} />

                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                            type="checkbox"
                            checked={isPreOrder}
                            onChange={(e) => setIsPreOrder(e.target.checked)}
                            className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        Pre-order (coming soon – customers can wishlist)
                    </label>
                    {isPreOrder && (
                        <div className="space-y-1">
                            <label htmlFor="pre_order_release_date" className="text-xs font-medium text-gray-500">Expected release date (optional)</label>
                            <input
                                id="pre_order_release_date"
                                type="date"
                                value={preOrderReleaseDate}
                                onChange={(e) => setPreOrderReleaseDate(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 px-8 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-black text-white px-8 py-2 text-sm font-medium hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting && <LoadingSpinner size="sm" className="text-white dark:text-black shrink-0" />}
                    {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
            </div>
        </form>
    )
}
