'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/context/toast-context'
import { Loader2, ShoppingBag, ShoppingCart } from 'lucide-react'
import { LoadingSpinner } from '@/components/loading-spinner'

type AddToCartButtonProps = {
    productId: number
    variant?: 'icon' | 'full'
    disabled?: boolean
    quantity?: number
    size?: string
    color?: string
    className?: string
}

export function AddToCartButton({ productId, variant = 'icon', disabled, quantity = 1, size, color, className = '' }: AddToCartButtonProps) {
    const { addItem } = useCart()
    const { toast } = useToast()
    const [isAdding, setIsAdding] = useState(false)

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsAdding(true)
        await addItem(productId, quantity, size, color)
        toast('Added to cart successfully!', 'success')
        setIsAdding(false)
    }

    if (variant === 'icon') {
        return (
            <button
                onClick={handleAdd}
                disabled={disabled || isAdding}
                className="h-10 w-10 flex items-center justify-center rounded-md bg-(--color-cta-bg) text-(--color-cta-text) hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
                {isAdding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <ShoppingBag className="w-5 h-5" />
                )}
            </button>
        )
    }

    return (
        <button
            onClick={handleAdd}
            disabled={disabled || isAdding}
            className={`w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-md bg-(--color-cta-bg) text-(--color-cta-text) text-body-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${className}`.trim()}
        >
            {isAdding ? (
                <LoadingSpinner size="sm" className="text-current shrink-0" />
            ) : (
                <ShoppingCart className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            )}
            {disabled ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
    )
}
