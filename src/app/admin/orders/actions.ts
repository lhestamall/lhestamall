'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getUserEmailById } from '@/utils/supabase/admin'
import { sendOrderStatusUpdate } from '@/lib/email'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin'
}

export async function updateOrderStatus(formData: FormData) {
    if (!await checkAdmin()) throw new Error('Unauthorized')

    const supabase = await createClient()
    const id = formData.get('id') as string
    const status = formData.get('status') as string

    const { data: orderBefore } = await supabase
        .from('orders')
        .select('user_id, shipping_address')
        .eq('id', id)
        .single()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)

    if (error) {
        throw new Error('Failed to update order status')
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)

    if (orderBefore?.user_id) {
        const email = await getUserEmailById(orderBefore.user_id)
        const customerName = (orderBefore.shipping_address as { full_name?: string } | null)?.full_name || 'Customer'
        const orderIdShort = id?.split('-')[0]?.toUpperCase() || id
        if (email) {
            await sendOrderStatusUpdate({
                to: email,
                customerName,
                orderIdShort,
                orderIdFull: id,
                status,
            })
        }
    }
}
