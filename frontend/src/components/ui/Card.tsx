import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  scanline?: boolean
}

export function Card({ children, className = '', scanline = false }: CardProps) {
  return (
    <div
      className={`bg-white border-2 border-ink rounded card-shadow ${scanline ? 'scanline-bg' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
