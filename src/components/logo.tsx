import React from 'react'

type LogoProps = { className?: string; /** Use when logo is on a dark bar (e.g. header) so the L and dot stay visible */ variant?: 'dark-bg' | 'light-bg' }

export function Logo({ className = 'w-8 h-8', variant = 'light-bg' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bag shape – uses currentColor (e.g. white on header, dark on footer) */}
      <path
        d="M32 30H68C73 30 75 32 76 36L84 84C85 89 82 92 76 92H24C18 92 15 89 16 84L24 36C25 32 27 30 32 30Z"
        fill="currentColor"
      />

      {/* Handle */}
      <path
        d="M40 30V24C40 18 44 14 50 14C56 14 60 18 60 24V30"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* L and dot – contrast with bag: on dark bar use header-bg, on light use same as text so they invert with the bag */}
      <g transform="rotate(-10, 50, 60)">
        <path
          d="M40 45H48V70H62V78H40V45Z"
          fill={variant === 'dark-bg' ? 'var(--color-header-bg)' : 'white'}
          className={variant === 'light-bg' ? 'dark:fill-black' : ''}
        />
        <circle
          cx="62"
          cy="45"
          r="4"
          fill={variant === 'dark-bg' ? 'var(--color-header-bg)' : 'white'}
          className={variant === 'light-bg' ? 'dark:fill-black' : ''}
        />
      </g>
    </svg>
  )
}
