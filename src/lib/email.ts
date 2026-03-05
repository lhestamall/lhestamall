import { Resend } from 'resend'
import { getAdminEmails, getCustomerEmails } from '@/utils/supabase/admin'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Lhesta Mall <onboarding@resend.dev>'
const appName = 'Lhesta Mall'

function canSend(): boolean {
  return Boolean(resend && process.env.RESEND_API_KEY)
}

function baseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  return url ? url.replace(/\/$/, '') : ''
}

/** Order confirmation – sent when an order is successfully placed (Paystack or pay on delivery). */
export async function sendOrderConfirmation(args: {
  to: string
  customerName: string
  orderIdShort: string
  orderIdFull: string
  totalAmount: number
}): Promise<{ ok: boolean; error?: string }> {
  if (!canSend()) {
    console.warn('[Email] Resend not configured; skipping order confirmation')
    return { ok: true }
  }
  const viewOrderUrl = baseUrl() ? `${baseUrl()}/account/orders/${args.orderIdFull}` : ''
  const subject = `${appName} – Order #${args.orderIdShort} confirmed`
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #171717; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="margin: 0 0 16px; font-size: 1.25rem;">Hi ${escapeHtml(args.customerName)},</h2>
  <p style="margin: 0 0 16px;">Thank you for your order. We've received it and will process it shortly.</p>
  <p style="margin: 0 0 8px;"><strong>Order #${escapeHtml(args.orderIdShort)}</strong></p>
  <p style="margin: 0 0 24px;">Total: <strong>GH₵ ${args.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></p>
  ${viewOrderUrl ? `<p style="margin: 0 0 24px;"><a href="${escapeHtml(viewOrderUrl)}" style="color: #171717; font-weight: 600;">View order</a></p>` : ''}
  <p style="margin: 0; font-size: 0.875rem; color: #737373;">— ${appName}</p>
</body>
</html>`
  const { error } = await resend!.emails.send({
    from: fromEmail,
    to: [args.to],
    subject,
    html,
  })
  if (error) {
    console.error('[Email] Order confirmation send failed:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Order status update email (shipped, delivered, cancelled, etc.) */
export async function sendOrderStatusUpdate(args: {
  to: string
  customerName: string
  orderIdShort: string
  orderIdFull: string
  status: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!canSend()) {
    console.warn('[Email] Resend not configured; skipping order status email')
    return { ok: true }
  }
  const statusLabel = args.status.charAt(0).toUpperCase() + args.status.slice(1)
  const subject = `${appName} – Order #${args.orderIdShort} is ${statusLabel}`
  const viewOrderUrl = baseUrl() ? `${baseUrl()}/account/orders/${args.orderIdFull}` : ''
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #171717; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="margin: 0 0 16px; font-size: 1.25rem;">Hi ${escapeHtml(args.customerName)},</h2>
  <p style="margin: 0 0 16px;">Your order <strong>#${escapeHtml(args.orderIdShort)}</strong> status has been updated to <strong>${escapeHtml(statusLabel)}</strong>.</p>
  ${viewOrderUrl ? `<p style="margin: 0 0 24px;"><a href="${escapeHtml(viewOrderUrl)}" style="color: #171717; font-weight: 600;">View order</a></p>` : '<p style="margin: 0 0 24px; color: #737373;">You can view your order from your account.</p>'}
  <p style="margin: 0; font-size: 0.875rem; color: #737373;">— ${appName}</p>
</body>
</html>`
  const { error } = await resend!.emails.send({
    from: fromEmail,
    to: [args.to],
    subject,
    html,
  })
  if (error) {
    console.error('[Email] Order status send failed:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Pre-order / wishlist item now available */
export async function sendPreOrderAvailable(args: {
  to: string
  customerName: string
  productName: string
  productUrl: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!canSend()) {
    console.warn('[Email] Resend not configured; skipping pre-order available email')
    return { ok: true }
  }
  const subject = `${appName} – "${args.productName}" is now in stock`
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #171717; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="margin: 0 0 16px; font-size: 1.25rem;">Hi ${escapeHtml(args.customerName)},</h2>
  <p style="margin: 0 0 16px;">Good news — an item on your wishlist is now available:</p>
  <p style="margin: 0 0 24px;"><strong>${escapeHtml(args.productName)}</strong></p>
  <p style="margin: 0 0 24px;"><a href="${escapeHtml(args.productUrl)}" style="color: #171717; font-weight: 600;">View product &amp; add to cart</a></p>
  <p style="margin: 0; font-size: 0.875rem; color: #737373;">— ${appName}</p>
</body>
</html>`
  const { error } = await resend!.emails.send({
    from: fromEmail,
    to: [args.to],
    subject,
    html,
  })
  if (error) {
    console.error('[Email] Pre-order available send failed:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** New order alert – sent to all admins when an order is placed. */
export async function sendNewOrderAlertToAdmins(args: {
  customerName: string
  orderIdShort: string
  orderIdFull: string
  totalAmount: number
}): Promise<{ ok: boolean; error?: string }> {
  if (!canSend()) {
    console.warn('[Email] Resend not configured; skipping admin new-order alert')
    return { ok: true }
  }
  const admins = await getAdminEmails()
  if (admins.length === 0) return { ok: true }
  const manageUrl = baseUrl() ? `${baseUrl()}/admin/orders/${args.orderIdFull}` : ''
  const subject = `${appName} – New order #${args.orderIdShort}`
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #171717; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="margin: 0 0 16px; font-size: 1.25rem;">New order</h2>
  <p style="margin: 0 0 8px;"><strong>Order #${escapeHtml(args.orderIdShort)}</strong></p>
  <p style="margin: 0 0 8px;">Customer: ${escapeHtml(args.customerName)}</p>
  <p style="margin: 0 0 24px;">Total: <strong>GH₵ ${args.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></p>
  ${manageUrl ? `<p style="margin: 0 0 24px;"><a href="${escapeHtml(manageUrl)}" style="color: #171717; font-weight: 600;">View in admin</a></p>` : ''}
  <p style="margin: 0; font-size: 0.875rem; color: #737373;">— ${appName}</p>
</body>
</html>`
  const { error } = await resend!.emails.send({
    from: fromEmail,
    to: admins,
    subject,
    html,
  })
  if (error) {
    console.error('[Email] Admin new-order alert failed:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Send an email to all admins (e.g. internal alerts, reports). */
export async function sendToAdmins(args: {
  subject: string
  bodyHtml: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!canSend()) {
    console.warn('[Email] Resend not configured; skipping sendToAdmins')
    return { ok: true }
  }
  const admins = await getAdminEmails()
  if (admins.length === 0) return { ok: true }
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #171717; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="margin: 0 0 16px; font-size: 1.25rem;">Admin notice</h2>
  <div>${args.bodyHtml}</div>
  <p style="margin: 24px 0 0; font-size: 0.875rem; color: #737373;">— ${appName}</p>
</body>
</html>`
  const { error } = await resend!.emails.send({
    from: fromEmail,
    to: admins,
    subject: args.subject,
    html,
  })
  if (error) {
    console.error('[Email] sendToAdmins failed:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Send an email to all customers (e.g. announcements). */
export async function sendToCustomers(args: {
  subject: string
  bodyHtml: string
}): Promise<{ ok: boolean; error?: string; count?: number }> {
  if (!canSend()) {
    console.warn('[Email] Resend not configured; skipping sendToCustomers')
    return { ok: true }
  }
  const customers = await getCustomerEmails()
  if (customers.length === 0) return { ok: true, count: 0 }
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #171717; max-width: 560px; margin: 0 auto; padding: 24px;">
  <div>${args.bodyHtml}</div>
  <p style="margin: 24px 0 0; font-size: 0.875rem; color: #737373;">— ${appName}</p>
</body>
</html>`
  const { error } = await resend!.emails.send({
    from: fromEmail,
    to: customers,
    subject: args.subject,
    html,
  })
  if (error) {
    console.error('[Email] sendToCustomers failed:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true, count: customers.length }
}

/** Generic notification (e.g. announcements, custom message from admin). */
export async function sendNotification(args: {
  to: string
  subject: string
  bodyHtml: string
  customerName?: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!canSend()) {
    console.warn('[Email] Resend not configured; skipping notification')
    return { ok: true }
  }
  const greeting = args.customerName ? `Hi ${escapeHtml(args.customerName)},<br><br>` : ''
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #171717; max-width: 560px; margin: 0 auto; padding: 24px;">
  ${greeting}
  <div>${args.bodyHtml}</div>
  <p style="margin: 24px 0 0; font-size: 0.875rem; color: #737373;">— ${appName}</p>
</body>
</html>`
  const { error } = await resend!.emails.send({
    from: fromEmail,
    to: [args.to],
    subject: args.subject,
    html,
  })
  if (error) {
    console.error('[Email] Notification send failed:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
