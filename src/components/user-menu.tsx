'use client'

import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { logout, updateProfile } from '@/app/login/actions'
import { Settings, LogOut, MapPin, X, Check, Loader2, ShoppingBag } from 'lucide-react'

type Profile = {
    full_name: string | null
    address: string | null
    city: string | null
    state: string | null
    zip_code: string | null
    country: string | null
    role: 'customer' | 'admin' | null
}

export function UserMenu({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('full_name, address, city, state, zip_code, country, role')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data)
            }
        }
        fetchProfile()
    }, [user.id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        const result = await updateProfile(formData)

        if (result.success) {
            setProfile({
                full_name: formData.get('full_name') as string,
                address: formData.get('address') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                zip_code: formData.get('zip_code') as string,
                country: formData.get('country') as string,
                role: profile?.role || 'customer'
            })
            setIsEditing(false)
        } else if (result.error) {
            alert(`Error: ${result.error}`)
            console.error('Profile update failed:', result.error)
        }
        setIsSaving(false)
    }

    return (
        <div className="relative">
            {/* Avatar Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 group focus:outline-none"
            >
                <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-bold ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-gray-200 transition-all">
                    {(profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden md:inline-block truncate max-w-[140px] group-hover:text-black dark:group-hover:text-white transition-colors">
                    {profile?.full_name || user.email || 'Account'}
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[60]"
                        onClick={() => {
                            setIsOpen(false)
                            setIsEditing(false)
                        }}
                    />
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Account</p>
                            <p className="text-sm font-bold truncate">{profile?.full_name || user.email || 'User'}</p>
                            {profile?.full_name && user.email && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {!isEditing ? (
                                <div className="space-y-4">
                                    {/* Shipping Summary */}
                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                <MapPin className="w-3 h-3" />
                                                Shipping Info
                                            </div>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        {profile?.address ? (
                                            <div className="text-sm space-y-0.5 text-gray-600 dark:text-gray-400">
                                                <p className="font-bold text-gray-900 dark:text-white">{profile.full_name}</p>
                                                <p>{profile.address}</p>
                                                <p>{profile.city}, {profile.state} {profile.zip_code}</p>
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">{profile.country}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No shipping info added yet.</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-1">
                                        <Link
                                            href="/account/orders"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full h-10 px-3 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-colors group"
                                        >
                                            <ShoppingBag className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                                            My Orders
                                        </Link>

                                        {profile?.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full h-10 px-3 flex items-center gap-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-colors group"
                                            >
                                                <Settings className="w-4 h-4 text-emerald-500" />
                                                Admin Panel
                                            </Link>
                                        )}

                                        <div className="h-px bg-gray-100 dark:bg-zinc-900 my-1" />

                                        <form action={logout}>
                                            <button className="w-full h-10 px-3 flex items-center gap-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group text-left">
                                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                Sign out
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                        <input
                                            name="full_name"
                                            defaultValue={profile?.full_name || ''}
                                            className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Address</label>
                                        <input
                                            name="address"
                                            defaultValue={profile?.address || ''}
                                            className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                            placeholder="123 Street Name"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">City</label>
                                            <input
                                                name="city"
                                                defaultValue={profile?.city || ''}
                                                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                                placeholder="City"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">State</label>
                                            <input
                                                name="state"
                                                defaultValue={profile?.state || ''}
                                                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                                placeholder="State"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Zip Code</label>
                                            <input
                                                name="zip_code"
                                                defaultValue={profile?.zip_code || ''}
                                                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                                placeholder="12345"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Country</label>
                                            <input
                                                name="country"
                                                defaultValue={profile?.country || ''}
                                                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                                                placeholder="Country"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-1 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
