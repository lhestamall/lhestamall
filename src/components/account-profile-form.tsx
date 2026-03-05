'use client'

import { useState } from 'react'
import { MapPin, Loader2, Check, LogOut } from 'lucide-react'
import { updateProfile } from '@/app/login/actions'
import { logout } from '@/app/login/actions'

type Profile = {
  full_name: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
}

export function AccountProfileForm({ profile }: { profile: Profile | null }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateProfile(formData)
      if (result?.success) {
        setIsEditing(false)
      } else if (result?.error) {
        alert(`Error: ${result.error}`)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 w-full py-3 px-4 rounded-(--radius-md) bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-title-sm font-semibold text-(--color-text) flex items-center gap-2">
            <MapPin className="w-5 h-5 text-(--color-text-muted)" aria-hidden />
            Shipping & profile
          </h2>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-label font-semibold text-(--color-link) hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {!isEditing ? (
          profile?.address ? (
            <div className="text-body-sm text-(--color-text-muted) space-y-1">
              <p className="font-medium text-(--color-text)">{profile.full_name}</p>
              <p>{profile.address}</p>
              <p>
                {profile.city}
                {profile.state && `, ${profile.state}`}
                {profile.zip_code && ` ${profile.zip_code}`}
              </p>
              {profile.country && (
                <p className="text-label uppercase font-medium mt-1">{profile.country}</p>
              )}
            </div>
          ) : (
            <p className="text-body-sm text-(--color-text-muted) italic">
              No shipping info added yet. Add your address for faster checkout.
            </p>
          )
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-label font-medium text-(--color-text-muted) block mb-1">
                Full name
              </label>
              <input
                name="full_name"
                defaultValue={profile?.full_name || ''}
                className="w-full min-h-10 px-3 rounded-(--radius-md) bg-(--color-bg) text-(--color-text) text-body-sm focus:outline-none focus:ring-2 focus:ring-(--color-link)"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="text-label font-medium text-(--color-text-muted) block mb-1">
                Address
              </label>
              <input
                name="address"
                defaultValue={profile?.address || ''}
                className="w-full min-h-10 px-3 rounded-(--radius-md) bg-(--color-bg) text-(--color-text) text-body-sm focus:outline-none focus:ring-2 focus:ring-(--color-link)"
                placeholder="123 Street Name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label font-medium text-(--color-text-muted) block mb-1">
                  City
                </label>
                <input
                  name="city"
                  defaultValue={profile?.city || ''}
                  className="w-full min-h-10 px-3 rounded-(--radius-md) bg-(--color-bg) text-(--color-text) text-body-sm focus:outline-none focus:ring-2 focus:ring-(--color-link)"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="text-label font-medium text-(--color-text-muted) block mb-1">
                  State
                </label>
                <input
                  name="state"
                  defaultValue={profile?.state || ''}
                  className="w-full min-h-10 px-3 rounded-(--radius-md) bg-(--color-bg) text-(--color-text) text-body-sm focus:outline-none focus:ring-2 focus:ring-(--color-link)"
                  placeholder="State"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label font-medium text-(--color-text-muted) block mb-1">
                  Zip code
                </label>
                <input
                  name="zip_code"
                  defaultValue={profile?.zip_code || ''}
                  className="w-full min-h-10 px-3 rounded-(--radius-md) bg-(--color-bg) text-(--color-text) text-body-sm focus:outline-none focus:ring-2 focus:ring-(--color-link)"
                  placeholder="12345"
                  required
                />
              </div>
              <div>
                <label className="text-label font-medium text-(--color-text-muted) block mb-1">
                  Country
                </label>
                <input
                  name="country"
                  defaultValue={profile?.country || ''}
                  className="w-full min-h-10 px-3 rounded-(--radius-md) bg-(--color-bg) text-(--color-text) text-body-sm focus:outline-none focus:ring-2 focus:ring-(--color-link)"
                  placeholder="Country"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 min-h-10 rounded-(--radius-md) bg-(--color-bg) text-(--color-text) text-body-sm font-semibold hover:bg-(--color-surface-hover) transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 min-h-10 rounded-(--radius-md) bg-(--color-cta-bg) text-(--color-cta-text) text-body-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                ) : (
                  <Check className="w-4 h-4" aria-hidden />
                )}
                Save
              </button>
            </div>
          </form>
        )}
      </section>

      <form action={logout}>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full min-h-10 px-4 rounded-(--radius-md) bg-red-100 text-red-700 text-body-sm font-semibold hover:bg-red-200 transition-colors dark:bg-red-900/60 dark:text-red-200 dark:hover:bg-red-900/80"
        >
          <LogOut className="w-4 h-4" aria-hidden />
          Sign out
        </button>
      </form>
    </div>
  )
}
