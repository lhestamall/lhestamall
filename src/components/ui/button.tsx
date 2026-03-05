import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
                    {
                        'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20':
                            variant === 'primary',
                        'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50':
                            variant === 'secondary',
                        'bg-transparent hover:bg-zinc-100 text-zinc-900': variant === 'ghost',
                        'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
                            variant === 'outline',
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-8 text-base': size === 'md',
                        'h-14 px-10 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, cn }
