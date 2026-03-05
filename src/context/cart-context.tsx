'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type CartItem = {
    id: string
    product_id: number
    quantity: number
    size?: string | null
    color?: string | null
    product: {
        name: string
        price: number
        image_url: string
    }
}

type CartContextType = {
    items: CartItem[]
    isLoading: boolean
    addItem: (productId: number, quantity?: number, size?: string, color?: string) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    totalItems: number
    totalPrice: number
    isCartOpen: boolean
    setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setItems([])
            setIsLoading(false)
            return
        }

        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                id,
                product_id,
                quantity,
                product:products (
                    name,
                    price,
                    image_url
                )
            `)
            .eq('user_id', user.id)

        if (!error && data) {
            setItems(data as any)
        }
        setIsLoading(false)
    }

    const addItem = async (productId: number, quantity: number = 1) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { error } = await supabase
            .from('cart_items')
            .insert({
                user_id: user.id,
                product_id: productId,
                quantity: quantity
            })

        if (error) {
            console.error('Error adding to cart:', error)
            alert(`Could not add to cart: ${error.message}`)
        } else {
            await fetchCart()
            setIsCartOpen(true)
        }
    }

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) {
            await removeItem(itemId)
            return
        }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', itemId)

        if (!error) {
            await fetchCart()
        }
    }

    const removeItem = async (itemId: string) => {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)

        if (!error) {
            await fetchCart()
        }
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{
            items,
            isLoading,
            addItem,
            updateQuantity,
            removeItem,
            totalItems,
            totalPrice,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
