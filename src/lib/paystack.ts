import 'server-only'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co'

if (!PAYSTACK_SECRET_KEY) {
  console.warn(
    '[Paystack] PAYSTACK_SECRET_KEY is not set. Payment initialization and verification will fail in production.'
  )
}

type InitializeTransactionPayload = {
  email: string
  amount: number
  currency?: string
  callback_url: string
  reference?: string
  metadata?: Record<string, unknown>
}

export type PaystackInitializeResponse = {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export type PaystackVerificationData = {
  status: string
  reference: string
  amount: number
  currency: string
  metadata?: {
    order_id?: string
    user_id?: string
    [key: string]: unknown
  }
}

export type PaystackVerifyResponse = {
  status: boolean
  message: string
  data?: PaystackVerificationData
}

export async function initializePaystackTransaction(
  payload: InitializeTransactionPayload
): Promise<PaystackInitializeResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key is not configured')
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      currency: payload.currency || 'GHS',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to initialize Paystack transaction: ${res.status} ${text}`)
  }

  return (await res.json()) as PaystackInitializeResponse
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key is not configured')
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to verify Paystack transaction: ${res.status} ${text}`)
  }

  return (await res.json()) as PaystackVerifyResponse
}

