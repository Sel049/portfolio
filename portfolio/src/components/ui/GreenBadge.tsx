import React from 'react'

interface GreenBadgeProps {
  /** Badge label text */
  children: React.ReactNode
  /** Additional Tailwind classes */
  className?: string
}

/**
 * Small pill badge with green-primary accent.
 * Used for the Hero status indicator and similar labeling needs.
 */
export default function GreenBadge({ children, className }: GreenBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-green bg-green-primary/10 text-green-primary text-label font-body font-medium${className ? ` ${className}` : ''}`}
    >
      {/* Pulsing dot indicator */}
      <span
        className="w-1.5 h-1.5 rounded-full bg-green-primary animate-pulse-slow"
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
