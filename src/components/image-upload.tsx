'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/context/toast-context'

type ImageUploadProps = {
    onImageUploaded: (url: string) => void
    currentImageUrl?: string
}

export function ImageUpload({ onImageUploaded, currentImageUrl }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
    const { toast } = useToast()
    const supabase = createClient()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast('Please upload an image file', 'error')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast('Image must be less than 5MB', 'error')
            return
        }

        setUploading(true)

        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `products/${fileName}`

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                throw error
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            setPreview(publicUrl)
            onImageUploaded(publicUrl)
            toast('Image uploaded successfully!', 'success')
        } catch (error) {
            console.error('Upload error:', error)
            toast('Failed to upload image', 'error')
        } finally {
            setUploading(false)
        }
    }

    const clearImage = () => {
        setPreview(null)
        onImageUploaded('')
    }

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium">Product Image</label>

            {preview ? (
                <div className="relative group">
                    <div className="aspect-square w-full max-w-md rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                        <img
                            src={preview}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-4 right-4 p-2 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full max-w-md h-64 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:border-black dark:hover:border-white transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
                        ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                        )}
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or WEBP (MAX. 5MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    )
}
