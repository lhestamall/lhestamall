'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Trash2, Loader2, AlertCircle, CheckSquare, X } from 'lucide-react'
import { deleteProduct, deleteProducts } from './actions'

type Product = {
    id: number
    name: string
    category: string | null
    price: number
    stock_quantity: number
}

export function ProductTable({ products }: { products: Product[] }) {
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [isDeleting, setIsDeleting] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [isSelectMode, setIsSelectMode] = useState(false)

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(products.map(p => p.id))
        }
    }

    const handleDeleteSingle = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return

        setDeletingId(id)
        const formData = new FormData()
        formData.append('id', id.toString())
        try {
            await deleteProduct(formData)
        } catch (error) {
            alert('Failed to delete product')
        }
        setDeletingId(null)
    }

    const handleDeleteBulk = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return

        setIsDeleting(true)
        try {
            await deleteProducts(selectedIds)
            setSelectedIds([])
            setIsSelectMode(false)
        } catch (error) {
            alert('Failed to delete products')
        }
        setIsDeleting(false)
    }

    const exitSelectMode = () => {
        setIsSelectMode(false)
        setSelectedIds([])
    }

    return (
        <div className="space-y-4">
            {/* Header / Action Bar */}
            <div className="flex items-center justify-between min-h-[40px]">
                <div className="flex items-center gap-4">
                    {!isSelectMode ? (
                        <button
                            onClick={() => setIsSelectMode(true)}
                            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                        >
                            <CheckSquare className="w-3.5 h-3.5" />
                            Select Items
                        </button>
                    ) : (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-200">
                            <button
                                onClick={exitSelectMode}
                                className="p-1 px-2 rounded-lg bg-gray-100 dark:bg-zinc-900 text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                            >
                                <X className="w-3.5 h-3.5" />
                                Cancel
                            </button>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                {selectedIds.length} Selected
                            </span>
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={handleDeleteBulk}
                                    disabled={isDeleting}
                                    className="text-red-600 hover:text-red-700 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    Delete Selected
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {products.length} Products
                </div>
            </div>

            <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden relative">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            {isSelectMode && (
                                <th className="h-12 px-4 w-10 align-middle">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                        checked={selectedIds.length === products.length && products.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                            )}
                            <th className="h-12 px-4 font-medium align-middle">Name</th>
                            <th className="h-12 px-4 font-medium align-middle">Category</th>
                            <th className="h-12 px-4 font-medium align-middle">Price</th>
                            <th className="h-12 px-4 font-medium align-middle">Stock</th>
                            <th className="h-12 px-4 font-medium align-middle text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={isSelectMode ? 6 : 5} className="p-8 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${selectedIds.includes(product.id) ? 'bg-gray-50 dark:bg-gray-900/50' : ''}`}
                                >
                                    {isSelectMode && (
                                        <td className="p-4 align-middle">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                                checked={selectedIds.includes(product.id)}
                                                onChange={() => toggleSelect(product.id)}
                                            />
                                        </td>
                                    )}
                                    <td className="p-4 align-middle font-medium truncate max-w-[200px]">
                                        {product.name}
                                    </td>
                                    <td className="p-4 align-middle text-gray-500">
                                        {product.category || '—'}
                                    </td>
                                    <td className="p-4 align-middle">GH₵ {product.price.toFixed(2)}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            {product.stock_quantity}
                                            {product.stock_quantity < 10 && (
                                                <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="text-gray-500 hover:text-black dark:hover:text-white text-sm font-medium transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteSingle(product.id)}
                                                disabled={deletingId === product.id}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === product.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
