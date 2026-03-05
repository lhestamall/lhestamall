'use client'

/**
 * Renders a price as GH₵ N.DD with N (integer part) larger than .DD (decimal part).
 */
export function Price({
  amount,
  className = '',
  size = 'card',
}: {
  amount: number | null | undefined
  className?: string
  size?: 'card' | 'detail' | 'inline'
}) {
  const value = amount != null ? Number(amount) : 0
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const [n, dd] = formatted.split('.')

  const sizes = {
    card: { n: 'text-title font-semibold', dd: 'text-body-sm' },
    detail: { n: 'text-4xl font-bold', dd: 'text-lg font-medium' },
    inline: { n: 'text-title font-semibold', dd: 'text-label' },
  }
  const s = sizes[size]

  return (
    <span className={className}>
      GH₵ <span className={s.n}>{n}</span><span className={s.dd}>.{dd ?? '00'}</span>
    </span>
  )
}
