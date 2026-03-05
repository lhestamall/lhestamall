import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react'
import { Logo } from '@/components/logo'

export default async function SuccessPage(props: {
    searchParams: Promise<{ id?: string; pay_on_delivery?: string }>
}) {
    const searchParams = await props.searchParams
    const orderId = searchParams.id
    const isPayOnDelivery = searchParams.pay_on_delivery === '1'

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-gray-100 dark:border-zinc-900 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative mx-auto w-20 h-20 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-25" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Order placed!</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {isPayOnDelivery
                            ? "You chose pay on delivery. We'll notify you when it ships—you'll pay when it arrives."
                            : "Your order has been placed successfully. We'll notify you when it ships."}
                    </p>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        We’ve sent a confirmation to your email.
                    </p>
                    <div className="pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</span>
                        <p className="font-mono text-sm">#{orderId?.split('-')[0].toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                    <Link
                        href="/shop"
                        className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all group"
                    >
                        <Logo className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">Keep Shopping</span>
                    </Link>
                    <Link
                        href="/account/orders"
                        className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all group"
                    >
                        <Package className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">My Orders</span>
                    </Link>
                </div>

            </div>
        </div>
    )
}
