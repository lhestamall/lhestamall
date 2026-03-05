'use client'

import { useState } from 'react'
import { sendNotificationAction } from './actions'
import { Mail, Send, Loader2 } from 'lucide-react'
import { useToast } from '@/context/toast-context'

export default function AdminNotificationsPage() {
  const [audience, setAudience] = useState<'admins' | 'customers'>('admins')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    const formData = new FormData()
    formData.set('audience', audience)
    formData.set('subject', subject)
    formData.set('message', message)
    try {
      const result = await sendNotificationAction(formData)
      if (result?.error) {
        toast(result.error, 'error')
      } else if (result?.success) {
        toast(result.message ?? 'Sent.', 'success')
        setSubject('')
        setMessage('')
      }
    } catch (err) {
      toast('Something went wrong.', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Send notification</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Send an email to all admins or all customers (e.g. announcements, updates).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as 'admins' | 'customers')}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm font-medium focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
          >
            <option value="admins">Admins only</option>
            <option value="customers">All customers</option>
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. New collection available"
            required
            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message. Plain text is fine."
            required
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:ring-1 focus:ring-black dark:focus:ring-white outline-none resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send
            </>
          )}
        </button>
      </form>
    </div>
  )
}
