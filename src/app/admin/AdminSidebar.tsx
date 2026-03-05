'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X, ChevronRight, Mail } from 'lucide-react'
import { logout } from '@/app/login/actions'

type NavItem = {
    label: string
    href: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Notifications', href: '/admin/notifications', icon: Mail },
]

export function AdminSidebar({ fullName, userEmail }: { fullName: string | null; userEmail: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const NavLink = ({ item }: { item: NavItem }) => {
        const isActive = pathname === item.href
        return (
            <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/10'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white'}`}
            >
                <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
        )
    }

    return (
        <>
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900 z-50 md:hidden flex items-center justify-between px-6">
                <span className="font-black text-xl tracking-tighter uppercase">Admin Panel</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-black border-r border-gray-100 dark:border-zinc-900 z-[70] transition-transform duration-500 ease-in-out md:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-24 flex items-center px-8 border-b border-gray-100 dark:border-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                            <span className="text-white dark:text-black font-black text-xl">L</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter uppercase">Lhesta Mall</span>
                    </div>
                </div>

                <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
                    <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Navigation</p>
                    {navItems.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-gray-100 dark:border-zinc-900 space-y-6">
                    <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-sm">
                            {(fullName?.[0] || userEmail?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate">{fullName || userEmail || 'Admin'}</p>
                            {fullName && userEmail && (
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">{userEmail}</p>
                            )}
                        </div>
                    </div>
                    <form action={logout}>
                        <button className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>
        </>
    )
}
