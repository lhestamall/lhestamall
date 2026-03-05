'use client'

import { useTransition } from 'react'
import { Clock } from 'lucide-react'
import { LoadingSpinner } from '@/components/loading-spinner'
import { updateOrderStatus } from './actions'

type OrderStatusSelectProps = {
  orderId: string
  currentStatus: string
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (newStatus: string) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', orderId)
      formData.append('status', newStatus)
      await updateOrderStatus(formData)
    })
  }

  return (
    <div className="relative group/status">
      <select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="h-8 px-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent text-xs font-semibold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none cursor-pointer appearance-none pr-8 disabled:opacity-50"
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {isPending ? (
        <LoadingSpinner size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 dark:text-gray-400 pointer-events-none" />
      ) : (
        <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
      )}
    </div>
  )
}
