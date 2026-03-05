'use client'

import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { AddToCartButton } from './add-to-cart-button'
import { AddToWishlistButton } from './add-to-wishlist-button'

type ProductPurchaseActionsProps = {
    productId: number
    stockQuantity: number
    sizes?: string[]
    colors?: string[]
    isPreOrder?: boolean
}

export function ProductPurchaseActions({ productId, stockQuantity, sizes = [], colors = [], isPreOrder = false }: ProductPurchaseActionsProps) {
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null)
    const [selectedColor, setSelectedColor] = useState<string | null>(colors.length === 1 ? colors[0] : null)

    const increment = () => {
        if (quantity < stockQuantity) {
            setQuantity(prev => prev + 1)
        }
    }

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    return (
        <div className="space-y-4">
            {sizes.length > 0 && (
                <div className="space-y-2">
                    <p className="text-label font-light text-(--color-text-muted)">Size</p>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSelectedSize(s)}
                                className={`px-4 py-2 rounded-md text-body-sm font-medium transition-colors ${selectedSize === s ? 'bg-(--color-link) text-(--color-cta-text)' : 'bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-link) hover:text-(--color-cta-text)'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {colors.length > 0 && (
                <div className="space-y-2">
                    <p className="text-label font-light text-(--color-text-muted)">Color</p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setSelectedColor(c)}
                                className={`px-4 py-2 rounded-md text-body-sm font-medium transition-colors ${selectedColor === c ? 'bg-(--color-link) text-(--color-cta-text)' : 'bg-(--color-surface) text-(--color-text) hover:bg-(--color-link) hover:text-(--color-cta-text)'}`}
                            >
                                <span
                                    className="inline-flex h-3.5 w-3.5 rounded-full border border-(--color-border) mr-2"
                                    style={{ backgroundColor: c }}
                                    aria-hidden="true"
                                />
                                <span>{c}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {stockQuantity > 0 && (
                <div className="space-y-2">
                    <p className="text-label font-light text-(--color-text-muted)">Quantity</p>
                    <div className="flex items-center rounded-md w-fit h-10 overflow-hidden bg-(--color-surface-hover) ring-1 ring-inset ring-(--color-text)/10">
                        <button
                            onClick={decrement}
                            className="px-4 h-full hover:bg-(--color-surface-hover) transition-colors disabled:opacity-30 text-(--color-text)"
                            disabled={quantity <= 1}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-body-sm font-semibold min-w-8 text-center text-(--color-text)">{quantity}</span>
                        <button
                            onClick={increment}
                            className="px-4 h-full hover:bg-(--color-surface-hover) transition-colors disabled:opacity-30 text-(--color-text)"
                            disabled={quantity >= stockQuantity}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="pt-2">
                {isPreOrder ? (
                    <AddToWishlistButton
                        productId={productId}
                        variant="text"
                        className="btn-primary w-full justify-center gap-2"
                    />
                ) : (
                    <AddToCartButton
                        productId={productId}
                        variant="full"
                        disabled={stockQuantity === 0 || (sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)}
                        quantity={quantity}
                        size={selectedSize ?? undefined}
                        color={selectedColor ?? undefined}
                    />
                )}
            </div>
        </div>
    )
}
