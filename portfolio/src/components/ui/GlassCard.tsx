import React from 'react'

interface GlassCardProps {
  /** Apply elevated border (green tint) instead of subtle white */
  elevated?: boolean
  /** Additional Tailwind classes */
  className?: string
  children: React.ReactNode
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ elevated = false, className, children }, ref) => {
    const baseClass = elevated ? 'glass-elevated' : 'glass'

    return (
      <div
        ref={ref}
        className={`${baseClass}${className ? ` ${className}` : ''}`}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export default GlassCard
