import { NextRequest, NextResponse } from 'next/server'
import { verifyAndFinalizePaystackPayment } from '@/app/checkout/actions'

function getPublicOrigin(request: NextRequest): string {
  // Prefer explicit app URL so redirects stay on ngrok/tunnel, not localhost
  const envOrigin = process.env.NEXT_PUBLIC_APP_URL
  if (envOrigin) return envOrigin.replace(/\/$/, '')
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  if (forwardedHost && forwardedProto) return `${forwardedProto}://${forwardedHost}`
  try {
    const u = new URL(request.url)
    return `${u.protocol}//${u.host}`
  } catch {
    return 'http://localhost:3000'
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference')
  const base = getPublicOrigin(request)

  if (!reference) {
    return NextResponse.redirect(new URL('/checkout/success', base))
  }

  try {
    const order = await verifyAndFinalizePaystackPayment(reference)
    return NextResponse.redirect(new URL(`/checkout/success?id=${order.id}`, base))
  } catch (error) {
    console.error('[Paystack Callback] Verification or finalization failed:', error)
    return NextResponse.redirect(new URL('/checkout', base))
  }
}

