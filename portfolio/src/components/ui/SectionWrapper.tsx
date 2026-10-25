import React from 'react'

interface SectionWrapperProps {
  id: string
  /** Tailwind class for top/bottom padding override */
  className?: string
  children: React.ReactNode
}

export default function SectionWrapper({ id, className, children }: SectionWrapperProps) {
  return (
    <section id={id}>
      <div className={`py-24 md:py-32 max-w-7xl mx-auto px-6${className ? ` ${className}` : ''}`}>
        {children}
      </div>``
    </section>
  )
}
 