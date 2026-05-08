import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-mono font-bold uppercase tracking-widest text-ink">
          {label}
        </label>
      )}
      <input
        className={`font-mono text-sm bg-white border-2 border-ink rounded px-3 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink focus:shadow-[0_0_0_2px_#f4ff4d] transition-shadow ${className}`}
        {...props}
      />
    </div>
  )
}
