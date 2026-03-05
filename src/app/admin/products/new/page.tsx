'use client'

import { useState } from 'react'
import { createProduct } from '../actions'
import { ProductImagesUpload } from '@/components/product-images-upload'
import { SizeSelector } from '@/components/size-selector'
import { ColorListEditor } from '@/components/color-list-editor'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/toast-context'

export default function NewProductPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [sizes, setSizes] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])
    const [isPreOrder, setIsPreOrder] = useState(false)
    const [preOrderReleaseDate, setPreOrderReleaseDate] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (formData: FormData) => {
        if (!imageUrls.length) {
            toast('Please add at least one product image', 'error')
            return
        }

        setIsSubmitting(true)
        formData.append('imageUrls', JSON.stringify(imageUrls))
        formData.append('sizes', JSON.stringify(sizes))
        formData.append('colors', JSON.stringify(colors))
        formData.append('is_pre_order', isPreOrder ? 'true' : 'false')
        if (preOrderReleaseDate) formData.append('pre_order_release_date', preOrderReleaseDate)

        try {
            await createProduct(formData)
            toast('Product created successfully!', 'success')
            // Don't manually redirect - the server action handles it
        } catch (error: any) {
            // Next.js redirects throw a special error - don't treat it as an error
            if (error?.message?.includes('NEXT_REDIRECT')) {
                toast('Product created successfully!', 'success')
                return
            }
            console.error('Create product error:', error)
            toast(error?.message || 'Failed to create product', 'error')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Create a new product for your store.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-8">
                    <div className="space-y-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm">
                        <ProductImagesUpload imageUrls={imageUrls} onImageUrlsChange={setImageUrls} />

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={isPreOrder}
                                    onChange={(e) => setIsPreOrder(e.target.checked)}
                                    className="rounded border-gray-300 text-black focus:ring-black"
                                />
                                Mark as pre-order
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

                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Product Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                required
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                placeholder="Premium Leather Bag"
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
                                className="flex w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                placeholder="Product description..."
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
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    placeholder="0.00"
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
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    placeholder="0"
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
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                placeholder="e.g., Clothing, Electronics, Home & Garden"
                            />
                        </div>

                        <SizeSelector sizes={sizes} onChange={setSizes} />
                        <ColorListEditor colors={colors} onChange={setColors} />
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
                            disabled={isSubmitting || !imageUrls.length}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-black text-white px-8 py-2 text-sm font-medium hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting && <LoadingSpinner size="sm" className="text-white dark:text-black shrink-0" />}
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
