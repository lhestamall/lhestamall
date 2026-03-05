'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendToAdmins, sendToCustomers } from '@/lib/email'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin'
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendNotificationAction(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const audience = formData.get('audience') as string
  const subject = String(formData.get('subject') || '').trim()
  const message = String(formData.get('message') || '').trim()

  if (!subject) return { error: 'Subject is required.' }
  if (!message) return { error: 'Message is required.' }
  if (audience !== 'admins' && audience !== 'customers') return { error: 'Invalid audience.' }

  const bodyHtml = `<p>${escapeHtml(message).replace(/\n/g, '</p><p>')}</p>`

  if (audience === 'admins') {
    const result = await sendToAdmins({ subject, bodyHtml })
    if (!result.ok) return { error: result.error || 'Failed to send.' }
    revalidatePath('/admin/notifications')
    return { success: true, message: 'Message sent to all admins.' }
  }

  const result = await sendToCustomers({ subject, bodyHtml })
  if (!result.ok) return { error: result.error || 'Failed to send.' }
  revalidatePath('/admin/notifications')
  return { success: true, message: `Message sent to ${result.count ?? 0} customers.` }
}
