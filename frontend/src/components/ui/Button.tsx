import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-mono font-bold uppercase tracking-wide cursor-pointer rounded border-2 border-ink transition-none select-none btn-press'

  const variants = {
    primary: 'bg-yellow text-ink',
    secondary: 'bg-ink text-cream',
    ghost: 'bg-transparent text-ink hover:bg-yellow',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabledClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
