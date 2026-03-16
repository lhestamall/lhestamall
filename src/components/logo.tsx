import React from 'react'
import Image from 'next/image'

type LogoProps = {
  className?: string
  /** Use when logo is on a dark bar (e.g. header) so tagline contrast is correct */
  variant?: 'dark-bg' | 'light-bg'
  /** Show "Shop smart. import better." in italics beneath the logo (styled to match reference: small, under curve, blended) */
  showTagline?: boolean
}

export function Logo({ className = 'w-8 h-8', variant = 'light-bg', showTagline = false }: LogoProps) {
  return (
    <span className="inline-flex flex-col items-start">
      <Image
        src="/logo.png"
        alt="Lhesta Mall – Shop Smart. Import Better."
        width={320}
        height={128}
        className={`object-contain object-left ${className}`}
        priority
        unoptimized
      />
      {showTagline && (
        <span
          className={`text-[7px] sm:text-[8px] italic -mt-2 leading-none whitespace-nowrap ml-[calc(20%+12px)] sm:ml-[calc(22%+12px)] scale-x-110 origin-left ${variant === 'dark-bg' ? 'text-(--color-header-text)/80' : 'text-(--color-text-muted)/90'}`}
        >
          Shop smart. import better.
        </span>
      )}
    </span>
  )
}
