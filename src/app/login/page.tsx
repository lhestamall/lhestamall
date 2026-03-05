import { login } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SubmitButton } from '@/components/submit-button'

export default async function LoginPage(props: {
    searchParams: Promise<{ error?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/shop')
    }

    const searchParams = await props.searchParams
    const error = searchParams.error

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)]">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Sign in to your account to continue
                    </p>
                    {error && (
                        <div className="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <SubmitButton
                            formAction={login}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                            loadingText="Signing in…"
                        >
                            Sign in
                        </SubmitButton>
                    </div>
                </form>

                <div className="text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <a href="/signup" className="underline underline-offset-4 hover:text-primary">
                        Create account
                    </a>
                </div>
            </div>
        </div>
    )
}
