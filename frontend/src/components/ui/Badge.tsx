import React from 'react'

type BadgeVariant = 'twitter' | 'linkedin' | 'newsletter' | 'default' | 'yellow'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  twitter: 'bg-twitter-blue text-white border-twitter-blue',
  linkedin: 'bg-linkedin-blue text-white border-linkedin-blue',
  newsletter: 'bg-newsletter-teal text-white border-newsletter-teal',
  default: 'bg-ink text-cream border-ink',
  yellow: 'bg-yellow text-ink border-ink',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider border-2 rounded ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
