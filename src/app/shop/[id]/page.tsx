import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react'
import { Price } from '@/components/price'
import { ProductRating } from '@/components/product-rating'
import { ProductPurchaseActions } from '@/components/product-purchase-actions'
import { AddToWishlistButton } from '@/components/add-to-wishlist-button'
import { ProductImage } from '@/components/product-image'
import { ProductGallery } from '@/components/product-gallery'
import { getProductImageUrl, getProductImageUrls } from '@/lib/product'

export const dynamic = 'force-dynamic'

export default async function ProductPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const idParam = params.id?.trim()
    const id = idParam ? parseInt(idParam, 10) : NaN
    if (!idParam || isNaN(id) || id < 1) {
        notFound()
    }

    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        notFound()
    }

    const { data: others } = await supabase.from('products').select('*').neq('id', product.id).limit(8).order('created_at', { ascending: false })
    const sorted = (others ?? []).sort((a, b) => {
        const aMatch = a.category === product.category ? 1 : 0
        const bMatch = b.category === product.category ? 1 : 0
        return bMatch - aMatch
    })
    const youMightLike = sorted.slice(0, 4)

    return (
        <div className="flex flex-col min-h-screen bg-(--color-bg) text-(--color-text)">
            <main className="flex-1">
                <div className="ds-container py-5 sm:py-8 lg:py-12">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-body-sm font-medium text-(--color-link) hover:text-(--color-link-hover) mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        Back to shop
                    </Link>

                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-start">
                        {/* Images */}
                        <div>
                            <ProductGallery
                                images={getProductImageUrls(product)}
                                alt={product.name}
                                overlayTopLeft={
                                    (product.is_pre_order || product.stock_quantity === 0) ? (
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-label font-light leading-tight ${
                                                product.is_pre_order
                                                    ? 'bg-(--color-surface-hover) text-(--color-text)'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                                            }`}
                                        >
                                            {product.is_pre_order ? 'Pre-order' : 'Out of stock'}
                                        </span>
                                    ) : undefined
                                }
                                overlayTopRight={
                                    <AddToWishlistButton productId={product.id} className="h-9 w-9 flex items-center justify-center rounded-md bg-(--color-surface) border border-(--color-border) hover:border-(--color-link) transition-colors" />
                                }
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-4">
                            <span className="inline-flex w-fit rounded-full px-4 py-2 text-body-sm font-medium bg-(--color-surface-hover) text-(--color-text-muted)">
                                {product.category || 'Collection'}
                            </span>
                            <h1 className="text-heading font-bold text-(--color-text) leading-tight">
                                {product.name}
                            </h1>
                            <Price amount={product.price} size="detail" className="text-(--color-text)" />
                            <ProductRating rating={product.rating} ratingCount={product.rating_count} className="text-body-sm" />

                            {product.description && (
                                <div className="pt-2">
                                    <p className="text-label font-light text-(--color-text-muted) mb-1.5">Description</p>
                                    <p className="text-body-sm text-(--color-text) leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3 py-3">
                                <div className="flex items-center gap-2 rounded-md bg-(--color-surface) px-3 py-2">
                                    <Truck className="w-4 h-4 text-(--color-text-muted)" />
                                    <span className="text-body-sm font-medium text-(--color-text)">Fast delivery</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-md bg-(--color-surface) px-3 py-2">
                                    <ShieldCheck className="w-4 h-4 text-(--color-text-muted)" />
                                    <span className="text-body-sm font-medium text-(--color-text)">Authentic</span>
                                </div>
                            </div>

                            <ProductPurchaseActions
                                productId={product.id}
                                stockQuantity={product.stock_quantity}
                                sizes={Array.isArray(product.sizes) ? product.sizes : []}
                                colors={Array.isArray(product.colors) ? product.colors : []}
                                isPreOrder={!!product.is_pre_order}
                            />
                        </div>
                    </div>

                    {youMightLike.length > 0 && (
                        <section className="mt-10 sm:mt-14 lg:mt-16">
                            <h2 className="text-title font-semibold text-(--color-text) mb-4">You might also like</h2>
                            <div
                                className="pill-scroll-fade pill-scroll-fade-soft -mx-4 sm:-mx-6 lg:-mx-8"
                                style={{ ['--pill-fade-color' as string]: 'var(--color-bg)' }}
                            >
                                <div className="overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-2">
                                    <div className="flex gap-4 w-max" style={{ gap: 'var(--space-4)' }}>
                                        {youMightLike.map((p) => (
                                            <article key={p.id} className="flex flex-col w-56 shrink-0 rounded-xl bg-(--color-surface) overflow-hidden">
                                                <Link href={`/shop/${p.id}`} className="aspect-4/5 relative overflow-hidden bg-(--color-surface-hover) block">
                                                    <ProductImage src={getProductImageUrl(p)} alt={p.name} className="w-full h-full object-cover" />
                                                    {(p.is_pre_order || p.stock_quantity === 0) && (
                                                        <span className={`absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-label font-light leading-tight ${p.is_pre_order ? 'bg-(--color-surface-hover) text-(--color-text)' : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'}`}>
                                                            {p.is_pre_order ? 'Pre-order' : 'Out of stock'}
                                                        </span>
                                                    )}
                                                </Link>
                                                <div className="p-3 flex flex-col flex-1 min-w-0 gap-1.5">
                                                    <span className="text-label font-light text-(--color-text-muted) truncate">{p.category || 'Collection'}</span>
                                                    <Price amount={p.price} size="card" className="text-(--color-text)" />
                                                    <h3 className="text-body-sm font-bold leading-snug line-clamp-2">
                                                        <Link href={`/shop/${p.id}`} className="text-(--color-text) hover:underline hover:text-(--color-text)">
                                                            {p.name}
                                                        </Link>
                                                    </h3>
                                                    <ProductRating rating={p.rating} ratingCount={p.rating_count} className="text-label font-light" />
                                                    <div className="mt-auto pt-2">
                                                        <Link
                                                            href={`/shop/${p.id}`}
                                                            className="btn-secondary w-full justify-center text-body-sm font-semibold"
                                                        >
                                                            View details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}
