'use client'

import Link from 'next/link'
import { ShoppingBag, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="glass mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between shadow-sm/50">
                <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                    LuxeStore
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                    <Link href="/collections" className="hover:text-black transition-colors">Collections</Link>
                    <Link href="/about" className="hover:text-black transition-colors">About</Link>
                </div>

                <div className="flex items-center gap-4">
                    {/* Cart */}
                    <button className="relative p-2 hover:bg-zinc-100 rounded-full transition-colors group">
                        <ShoppingBag className="w-5 h-5 text-zinc-700 group-hover:text-black" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User/Auth */}
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-full">
                            <User className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
