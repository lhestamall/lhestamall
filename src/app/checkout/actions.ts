'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { initializePaystackTransaction, verifyPaystackTransaction } from '@/lib/paystack'
import { getUserEmailById } from '@/utils/supabase/admin'
import { sendOrderConfirmation, sendNewOrderAlertToAdmins } from '@/lib/email'

type ShippingAddress = {
    full_name: string
    address: string
    city: string
    state: string
    zip_code: string
    country: string
}

async function finalizeOrderAfterSuccessfulPayment(args: {
    orderId: string
    expectedAmount: number
}) {
    const supabase = await createClient()

    // Fetch order with user id and ensure it is not already finalized
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', args.orderId)
        .maybeSingle()

    if (orderError || !order) {
        throw new Error('Order not found')
    }

    if (order.payment_status === 'success' || order.status === 'processing') {
        // Idempotency: if already finalized, just return
        return order
    }

    // 1. Get cart items for this user
    const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
            *,
            product:products(*)
        `)
        .eq('user_id', order.user_id)

    if (cartError || !cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty or missing for this order')
    }

    // 2. Calculate total and ensure it matches both expectedAmount and stored total_amount
    const cartTotal = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0)

    const storedTotal = Number(order.total_amount)
    const roundedCartTotal = Number(cartTotal.toFixed(2))
    const roundedExpected = Number(args.expectedAmount.toFixed(2))

    if (roundedCartTotal !== roundedExpected || roundedCartTotal !== Number(storedTotal.toFixed(2))) {
        throw new Error('Amount mismatch between cart, order, and payment provider')
    }

    // 3. Create order items and update stock in a best-effort, idempotent manner
    for (const item of cartItems) {
        await supabase.from('order_items').insert({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.product.price,
            ...(item.size != null && item.size !== '' && { size: item.size }),
            ...(item.color != null && item.color !== '' && { color: item.color }),
        })

        const newStock = Math.max(0, item.product.stock_quantity - item.quantity)
        await supabase.from('products').update({ stock_quantity: newStock }).eq('id', item.product_id)
    }

    // 4. Clear cart
    await supabase.from('cart_items').delete().eq('user_id', order.user_id)

    // 5. Update order payment + status
    const { data: updatedOrder } = await supabase
        .from('orders')
        .update({
            status: 'processing',
            payment_status: 'success'
        })
        .eq('id', order.id)
        .select()
        .single()

    revalidatePath('/admin/orders')
    revalidatePath('/admin')
    revalidatePath('/shop')

    const orderFinal = updatedOrder ?? order
    const customerName = (order.shipping_address as { full_name?: string } | null)?.full_name || 'Customer'
    const email = await getUserEmailById(order.user_id)
    if (email) {
        await sendOrderConfirmation({
            to: email,
            customerName,
            orderIdShort: order.id.split('-')[0].toUpperCase(),
            orderIdFull: order.id,
            totalAmount: Number(order.total_amount),
        })
    }
    return orderFinal
}

export async function initializePaystackCheckout(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // 1. Get cart items
    const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
            *,
            product:products(*)
        `)
        .eq('user_id', user.id)

    if (cartError || !cartItems || cartItems.length === 0) {
        redirect(`/checkout?error=${encodeURIComponent('Your cart is empty. Add items before checking out.')}`)
    }

    // 2. Fetch shipping info from form
    const shippingAddress: ShippingAddress = {
        full_name: formData.get('full_name') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip_code: formData.get('zip_code') as string,
        country: formData.get('country') as string,
    }

    // Basic server-side validation
    if (!shippingAddress.full_name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.country) {
        redirect(`/checkout?error=${encodeURIComponent('Please fill in all required shipping fields (name, address, city, country).')}`)
    }

    // 3. Calculate total
    const totalAmount = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0)
    const roundedTotal = Number(totalAmount.toFixed(2))

    // 4. Create a pending order with payment fields
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: roundedTotal,
            shipping_address: shippingAddress,
            status: 'pending',
            payment_provider: 'paystack',
            payment_status: 'initialized'
        })
        .select()
        .single()

    if (orderError || !order) {
        console.error('Order creation error:', orderError)
        const msg = orderError?.message?.includes('row-level security')
            ? 'Permission denied. Ensure your database allows users to create orders (e.g. RLS policy "Users can insert their own orders").'
            : 'Failed to create order'
        throw new Error(msg)
    }

    // 5. Initialize Paystack transaction server-side
    // Paystack requires a valid HTTPS callback URL; localhost is not accepted.
    const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000')

    let callbackUrl: string
    try {
        callbackUrl = new URL('/checkout/paystack/callback', origin.endsWith('/') ? origin.slice(0, -1) : origin).href
    } catch {
        throw new Error('Invalid NEXT_PUBLIC_APP_URL: could not build callback URL')
    }

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
    if (!callbackUrl.startsWith('https://') || isLocalhost) {
        throw new Error(
            'Paystack requires an HTTPS callback URL. For local development, use a tunnel (e.g. ngrok: https://ngrok.com) and set NEXT_PUBLIC_APP_URL to your tunnel URL (e.g. https://abc123.ngrok.io).'
        )
    }

    const email = (user as any).email ?? (user as any).user_metadata?.email

    if (!email) {
        throw new Error('User email is required for payment')
    }

    // Paystack expects amounts in the minor unit (pesewas for GHS),
    // while all prices in your app and database remain in Ghana Cedis.
    const amountInPesewas = Math.round(roundedTotal * 100)

    const initializeResponse = await initializePaystackTransaction({
        email,
        amount: amountInPesewas,
        currency: 'GHS',
        callback_url: callbackUrl,
        metadata: {
            order_id: order.id,
            user_id: user.id,
        },
    })

    if (!initializeResponse.status || !initializeResponse.data) {
        console.error('Paystack initialization failed:', initializeResponse)
        throw new Error('Failed to initialize payment')
    }

    const reference = initializeResponse.data.reference

    // 6. Store payment reference on the order for verification and idempotency
    await supabase
        .from('orders')
        .update({
            payment_reference: reference
        })
        .eq('id', order.id)

    // 7. Redirect user to Paystack hosted checkout
    redirect(initializeResponse.data.authorization_url)
}

/** Creates order, order_items, updates stock, clears cart. Used for Pay on delivery (no Paystack). */
async function createOrderAndFinalize(args: {
    userId: string
    shippingAddress: ShippingAddress
    totalAmount: number
    paymentProvider: 'paystack' | 'pay_on_delivery'
}) {
    const supabase = await createClient()
    const { userId, shippingAddress, totalAmount, paymentProvider } = args

    const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`*, product:products(*)`)
        .eq('user_id', userId)

    if (cartError || !cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty')
    }

    const roundedTotal = Number(totalAmount.toFixed(2))

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId,
            total_amount: roundedTotal,
            shipping_address: shippingAddress,
            status: 'processing',
            payment_provider: paymentProvider,
            payment_status: paymentProvider === 'paystack' ? 'initialized' : null,
        })
        .select()
        .single()

    if (orderError || !order) {
        console.error('Order creation error:', orderError)
        throw new Error(orderError?.message?.includes('row-level security') ? 'Permission denied.' : 'Failed to create order')
    }

    for (const item of cartItems) {
        await supabase.from('order_items').insert({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.product.price,
            ...(item.size != null && item.size !== '' && { size: item.size }),
            ...(item.color != null && item.color !== '' && { color: item.color }),
        })
        const newStock = Math.max(0, item.product.stock_quantity - item.quantity)
        await supabase.from('products').update({ stock_quantity: newStock }).eq('id', item.product_id)
    }

    await supabase.from('cart_items').delete().eq('user_id', userId)
    revalidatePath('/admin/orders')
    revalidatePath('/admin')
    revalidatePath('/shop')

    const customerName = shippingAddress.full_name || 'Customer'
    const userEmail = await getUserEmailById(userId)
    if (userEmail) {
        await sendOrderConfirmation({
            to: userEmail,
            customerName,
            orderIdShort: order.id.split('-')[0].toUpperCase(),
            orderIdFull: order.id,
            totalAmount: roundedTotal,
        })
    }
    await sendNewOrderAlertToAdmins({
        customerName,
        orderIdShort: order.id.split('-')[0].toUpperCase(),
        orderIdFull: order.id,
        totalAmount: roundedTotal,
    })
    return order
}

/** Checkout form submission: dispatches to Paystack or Pay on delivery. */
export async function submitCheckout(formData: FormData) {
    const paymentMethod = formData.get('payment_method') as string | null
    const isPayOnDelivery = paymentMethod === 'pay_on_delivery'

    if (isPayOnDelivery) {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const shippingAddress: ShippingAddress = {
            full_name: formData.get('full_name') as string,
            address: formData.get('address') as string,
            city: formData.get('city') as string,
            state: formData.get('state') as string,
            zip_code: formData.get('zip_code') as string,
            country: formData.get('country') as string,
        }
        if (!shippingAddress.full_name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.country) {
            throw new Error('Invalid shipping address')
        }

        const { data: cartItems } = await supabase.from('cart_items').select('*, product:products(*)').eq('user_id', user.id)
        if (!cartItems?.length) throw new Error('Cart is empty')
        const totalAmount = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0)

        const order = await createOrderAndFinalize({
            userId: user.id,
            shippingAddress,
            totalAmount,
            paymentProvider: 'pay_on_delivery',
        })
        redirect(`/checkout/success?id=${order.id}&pay_on_delivery=1`)
    }

    await initializePaystackCheckout(formData)
}

// This helper is used from the Paystack callback route to verify the transaction
export async function verifyAndFinalizePaystackPayment(reference: string) {
    const verification = await verifyPaystackTransaction(reference)

    if (!verification.status || !verification.data) {
        throw new Error('Failed to verify Paystack transaction')
    }

    const data = verification.data

    if (data.status !== 'success') {
        throw new Error('Payment not successful')
    }

    if (data.currency !== 'GHS') {
        throw new Error('Unexpected currency from payment provider')
    }

    const amountFromProvider = data.amount / 100
    const orderId = data.metadata?.order_id as string | undefined

    if (!orderId) {
        throw new Error('Order ID missing from payment metadata')
    }

    const order = await finalizeOrderAfterSuccessfulPayment({
        orderId,
        expectedAmount: amountFromProvider,
    })

    return order
}

