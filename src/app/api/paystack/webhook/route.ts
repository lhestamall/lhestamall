import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { verifyPaystackTransaction } from '@/lib/paystack'
import { createClient as createServerClient } from '@/utils/supabase/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

function isValidSignature(rawBody: string, signature: string | null): boolean {
  if (!PAYSTACK_SECRET_KEY || !signature) return false

  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex')

  return hash === signature
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  if (!isValidSignature(rawBody, signature)) {
    console.warn('[Paystack Webhook] Invalid signature')
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  if (payload?.event !== 'charge.success') {
    // We only care about successful charges for now
    return NextResponse.json({ ok: true })
  }

  const reference = payload?.data?.reference as string | undefined

  if (!reference) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  try {
    // Double-check with Paystack verify endpoint to protect against spoofed webhook bodies
    const verification = await verifyPaystackTransaction(reference)

    if (!verification.status || !verification.data || verification.data.status !== 'success') {
      return NextResponse.json({ ok: false }, { status:400 })
    }

    const data = verification.data

    const orderId = data.metadata?.order_id as string | undefined
    const amountFromProvider = data.amount / 100

    if (!orderId) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    // Minimal, idempotent update here: mark payment as success if not already;
    // the callback route is responsible for full order finalization (items, stock, cart clear).
    const supabase = await createServerClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle()

    if (error || !order) {
      return NextResponse.json({ ok: false }, { status: 404 })
    }

    const storedTotal = Number(order.total_amount)

    if (Number(storedTotal.toFixed(2)) !== Number(amountFromProvider.toFixed(2))) {
      // Amount mismatch – do not mark as paid
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    if (order.payment_status === 'success') {
      // Already processed
      return NextResponse.json({ ok: true })
    }

    await supabase
      .from('orders')
      .update({
        payment_status: 'success',
      })
      .eq('id', orderId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Paystack Webhook] Error handling webhook:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

