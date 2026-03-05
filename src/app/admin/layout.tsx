import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Verify admin role and get full name
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/shop')
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50 dark:bg-zinc-950">
            <AdminSidebar fullName={profile?.full_name || null} userEmail={user.email || ''} />

            <main className="flex-1 flex flex-col md:pl-72 pt-16 md:pt-0">
                <div className="flex-1 p-6 sm:p-10 lg:p-16 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
