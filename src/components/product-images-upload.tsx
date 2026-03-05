'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Upload, X, Star } from 'lucide-react'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useToast } from '@/context/toast-context'

type ProductImagesUploadProps = {
  imageUrls: string[]
  onImageUrlsChange: (urls: string[]) => void
}

export function ProductImagesUpload({ imageUrls, onImageUrlsChange }: ProductImagesUploadProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0) return
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast('Please upload image files only', 'error')
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        toast(`"${file.name}" must be less than 5MB`, 'error')
        continue
      }
    }
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024)
    if (validFiles.length === 0) return
    setUploading(true)
    const newUrls: string[] = []
    try {
      for (const file of validFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `products/${fileName}`
        const { error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath)
        newUrls.push(publicUrl)
      }
      onImageUrlsChange([...imageUrls, ...newUrls])
      toast(validFiles.length === 1 ? 'Image added' : `${validFiles.length} images added`, 'success')
    } catch (err) {
      console.error(err)
      toast('Failed to upload image(s)', 'error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    onImageUrlsChange(imageUrls.filter((_, i) => i !== index))
  }

  const setAsMain = (index: number) => {
    if (index === 0) return
    const reordered = [imageUrls[index], ...imageUrls.slice(0, index), ...imageUrls.slice(index + 1)]
    onImageUrlsChange(reordered)
    toast('Main display image updated', 'success')
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Product Images</label>
      <div className="flex flex-wrap gap-4">
        {imageUrls.map((url, index) => (
          <div key={`${url}-${index}`} className="relative group">
            <div className="aspect-square w-28 h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-1 -right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
            {index === 0 ? (
              <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">Main</span>
            ) : (
              <button
                type="button"
                onClick={() => setAsMain(index)}
                className="absolute bottom-1 left-1 flex items-center gap-1 text-[10px] font-bold bg-white/90 dark:bg-black/90 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-gray-200 dark:border-zinc-700"
                aria-label="Set as main display"
              >
                <Star className="w-3 h-3" />
                Set as main
              </button>
            )}
          </div>
        ))}
        <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-black dark:hover:border-white transition-colors shrink-0">
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} />
          {uploading ? <LoadingSpinner size="lg" className="text-gray-400" /> : <Upload className="w-8 h-8 text-gray-400" />}
          <span className="text-[10px] text-gray-500 mt-1">Add</span>
        </label>
      </div>
      <p className="text-xs text-gray-500">First image is the main display. Hover an image and click “Set as main” to change it. You can select multiple images at once.</p>
    </div>
  )
}
