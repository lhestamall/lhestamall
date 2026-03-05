import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client with service role for admin operations
 * (e.g. looking up user email by id for sending notifications).
 * Requires SUPABASE_SERVICE_ROLE_KEY in env.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) return null
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } })
}

export async function getUserEmailById(userId: string): Promise<string | null> {
  const admin = createAdminClient()
  if (!admin) return null
  const { data, error } = await admin.auth.admin.getUserById(userId)
  if (error || !data?.user?.email) return null
  return data.user.email
}

/** Returns email addresses of all users with role = 'admin'. */
export async function getAdminEmails(): Promise<string[]> {
  const admin = createAdminClient()
  if (!admin) return []
  const { data: profiles, error } = await admin
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
  if (error || !profiles?.length) return []
  const emails: string[] = []
  for (const p of profiles) {
    const email = await getUserEmailById(p.id)
    if (email) emails.push(email)
  }
  return emails
}

/** Returns email addresses of all non-admin users (customers). */
export async function getCustomerEmails(): Promise<string[]> {
  const admin = createAdminClient()
  if (!admin) return []
  const { data: profiles, error } = await admin
    .from('profiles')
    .select('id, role')
  if (error || !profiles?.length) return []
  const customerIds = profiles.filter((p) => p.role !== 'admin').map((p) => p.id)
  const emails: string[] = []
  const seen = new Set<string>()
  for (const id of customerIds) {
    const email = await getUserEmailById(id)
    if (email && !seen.has(email)) {
      seen.add(email)
      emails.push(email)
    }
  }
  return emails
}
