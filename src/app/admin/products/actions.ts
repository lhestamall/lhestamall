'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient, getUserEmailById } from '@/utils/supabase/admin'
import { sendPreOrderAvailable, sendToAdmins } from '@/lib/email'

const LOW_STOCK_THRESHOLD = 5

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        console.error('Auth check failed:', userError)
        return false
    }

    // Try to get the profile. If it doesn't exist, we might need to create it 
    // or the user just isn't an admin yet.
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError) {
        console.error('Profile fetch failed:', profileError)
        // If profile doesn't exist, they definitely aren't an admin
        return false
    }

    const isAdmin = profile?.role === 'admin'
    if (!isAdmin) {
        console.warn(`User ${user.email} tried to perform admin action but has role: ${profile?.role}`)
    }

    return isAdmin
}

export async function createProduct(formData: FormData) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) throw new Error('Unauthorized: Admin access required')

    const supabase = await createClient()

    const name = formData.get('name')
    const description = formData.get('description')
    const price = formData.get('price')
    const category = formData.get('category')
    const stock = formData.get('stock')
    const imageUrlsRaw = formData.get('imageUrls')
    const sizesRaw = formData.get('sizes')
    const colorsRaw = formData.get('colors')
    const imageUrls = imageUrlsRaw ? (JSON.parse(imageUrlsRaw as string) as string[]) : []
    const primaryImage = imageUrls[0] ?? null

    const isPreOrder = formData.get('is_pre_order') === 'on' || formData.get('is_pre_order') === 'true'
    const releaseDateRaw = formData.get('pre_order_release_date') as string | null
    const preOrderReleaseDate = releaseDateRaw && releaseDateRaw.trim() ? releaseDateRaw.trim() : null

    if (!String(name).trim()) throw new Error('Product name is required.')
    if (!imageUrls?.length) throw new Error('Please add at least one product image.')
    if (Number.isNaN(Number(price)) || Number(price) < 0) throw new Error('Please enter a valid price.')

    const { error } = await supabase.from('products').insert({
        name,
        description,
        price,
        category,
        stock_quantity: Number(stock),
        image_url: primaryImage,
        image_urls: imageUrls,
        sizes: sizesRaw ? (JSON.parse(sizesRaw as string) as string[]) : [],
        colors: colorsRaw ? (JSON.parse(colorsRaw as string) as string[]) : [],
        is_pre_order: isPreOrder,
        pre_order_release_date: preOrderReleaseDate,
    })

    if (error) {
        console.error('Create Product Error:', error)
        throw new Error('Failed to create product: ' + error.message)
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}

export async function updateProduct(formData: FormData) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) throw new Error('Unauthorized: Admin access required')

    const supabase = await createClient()
    const productId = Number(formData.get('id'))
    const imageUrlsRaw = formData.get('imageUrls')
    const imageUrls = imageUrlsRaw ? (JSON.parse(imageUrlsRaw as string) as string[]) : []
    const sizesRaw = formData.get('sizes')
    const colorsRaw = formData.get('colors')
    const isPreOrder = formData.get('is_pre_order') === 'on' || formData.get('is_pre_order') === 'true'
    const releaseDateRaw = formData.get('pre_order_release_date') as string | null
    const preOrderReleaseDate = releaseDateRaw && releaseDateRaw.trim() ? releaseDateRaw.trim() : null
    const newStock = Number(formData.get('stock'))
    const productName = String(formData.get('name') || '')

    const { data: oldProduct } = await supabase
        .from('products')
        .select('is_pre_order, name')
        .eq('id', productId)
        .single()

    const name = formData.get('name')
    if (!String(name).trim()) throw new Error('Product name is required.')
    if (Number.isNaN(Number(formData.get('price'))) || Number(formData.get('price')) < 0) {
        throw new Error('Please enter a valid price.')
    }

    const updates = {
        name,
        description: formData.get('description'),
        price: Number(formData.get('price')),
        category: formData.get('category'),
        stock_quantity: newStock,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        sizes: sizesRaw ? (JSON.parse(sizesRaw as string) as string[]) : [],
        colors: colorsRaw ? (JSON.parse(colorsRaw as string) as string[]) : [],
        is_pre_order: isPreOrder,
        pre_order_release_date: preOrderReleaseDate,
    }

    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)

    if (error) {
        console.error('Update Product Error:', error)
        throw new Error('Failed to update product: ' + error.message)
    }

    const wasPreOrder = oldProduct?.is_pre_order === true
    if (wasPreOrder && !isPreOrder && newStock > 0 && productName) {
        const admin = createAdminClient()
        if (admin) {
            const { data: wishlistRows } = await admin
                .from('wishlist_items')
                .select('user_id')
                .eq('product_id', productId)
            const userIds = [...new Set((wishlistRows ?? []).map((r) => r.user_id))]
            if (userIds.length > 0) {
                const { data: profiles } = await admin
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', userIds)
                const nameByUserId = new Map((profiles ?? []).map((p) => [p.id, p.full_name || 'Customer']))
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
                const productUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}/shop/${productId}` : `/shop/${productId}`
                for (const uid of userIds) {
                    const email = await getUserEmailById(uid)
                    if (email) {
                        await sendPreOrderAvailable({
                            to: email,
                            customerName: nameByUserId.get(uid) || 'Customer',
                            productName,
                            productUrl,
                        })
                    }
                }
            }
        }
    }

    if (newStock <= LOW_STOCK_THRESHOLD && productName) {
        const base = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
        const adminProductsUrl = base ? `${base.replace(/\/$/, '')}/admin/products` : '/admin/products'
        await sendToAdmins({
            subject: 'Low stock alert',
            bodyHtml: `<p><strong>${escapeHtml(productName)}</strong> (ID ${productId}) is low on stock: <strong>${newStock}</strong> unit${newStock === 1 ? '' : 's'}.</p><p><a href="${adminProductsUrl}">View products</a></p>`,
        })
    }

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    redirect('/admin/products')
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function deleteProduct(formData: FormData) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) throw new Error('Unauthorized: Admin access required')

    const supabase = await createClient()
    const id = formData.get('id')

    console.log('Deleting product with ID:', id)

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', Number(id))

    if (error) {
        console.error('Delete Product Error:', error)
        throw new Error('Failed to delete product: ' + error.message)
    }

    revalidatePath('/admin/products')
    revalidatePath('/shop')
}

export async function deleteProducts(ids: number[]) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) throw new Error('Unauthorized: Admin access required')

    const supabase = await createClient()

    console.log('Bulk deleting products with IDs:', ids)

    const { error } = await supabase
        .from('products')
        .delete()
        .in('id', ids)

    if (error) {
        console.error('Bulk Delete Products Error:', error)
        throw new Error('Failed to delete products: ' + error.message)
    }

    revalidatePath('/admin/products')
    revalidatePath('/shop')
}
