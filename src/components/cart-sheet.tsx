'use client'

import React from 'react'
import { useCart } from '@/context/cart-context'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { getProductImageUrl } from '@/lib/product'

export function CartSheet() {
    const { items, totalPrice, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart()

    if (!isCartOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sheet */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-(--color-surface) shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-title font-bold text-(--color-text)">Your cart</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-(--color-surface-hover) rounded-full transition-colors text-(--color-text)"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-(--color-surface-hover) rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-(--color-text-muted)" />
                            </div>
                            <div>
                                <h3 className="text-title-sm font-bold text-(--color-text)">Your cart is empty</h3>
                                <p className="text-body-sm text-(--color-text-muted)">Add items from the shop and they’ll appear here.</p>
                            </div>
                            <Link
                                href="/shop"
                                onClick={() => setIsCartOpen(false)}
                                className="btn-primary inline-flex items-center justify-center"
                            >
                                Browse shop
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="w-20 h-20 rounded-(--radius-md) overflow-hidden bg-(--color-surface-hover) flex-shrink-0">
                                    <img
                                        src={getProductImageUrl(item.product)}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-body-sm leading-tight text-(--color-text)">{item.product.name}</h4>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-(--color-text-muted) hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {(item.size || item.color) && (
                                        <p className="text-label text-(--color-text-muted)">
                                            {[item.size, item.color].filter(Boolean).join(' · ')}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-label text-(--color-text-muted)">
                                            <span className="font-medium">Qty:</span>
                                            <span className="font-bold text-(--color-text) bg-(--color-surface-hover) px-2 py-0.5 rounded-(--radius-sm) cursor-default">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <span className="font-bold text-body-sm text-(--color-text)">GH₵ {(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-body-sm text-(--color-text-muted)">Subtotal</span>
                            <span className="text-title font-bold text-(--color-text)">GH₵ {totalPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-label text-(--color-text-muted)">Shipping and taxes calculated at checkout.</p>
                        <Link
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="btn-primary flex w-full h-14 items-center justify-center text-lg"
                        >
                            Checkout Now
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
