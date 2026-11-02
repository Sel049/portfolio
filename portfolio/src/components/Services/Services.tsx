import React from 'react'
import type { Service } from '../../types'
import GlassCard from '../ui/GlassCard'
import SectionWrapper from '../ui/SectionWrapper'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface ServicesProps {
  services: Service[]
}

// ─── Inline SVG icons keyed by the icon name used in services.ts ──────────────

const ServiceIcon: React.FC<{ name: string }> = ({ name }) => {
  const props = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'monitor':
      return (
        <svg {...props}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    case 'server':
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      )
    case 'layers':
      return (
        <svg {...props}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    case 'zap':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    case 'code':
      return (
        <svg {...props}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    default:
      // Fallback: generic sparkle / star shape
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
      )
  }
}

// ─── ServiceCard ──────────────────────────────────────────────────────────────

/**
 * Renders a single service entry with its icon, title, and description.
 * Requirements: 10.2
 */
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <GlassCard className="p-6 flex flex-col gap-4 h-full">
    {/* Icon — Req 10.2 */}
    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-primary/10 text-green-primary shrink-0">
      <ServiceIcon name={service.icon} />
    </div>

    {/* Title — Req 10.2 */}
    <h3 className="font-heading text-card text-text-primary leading-snug">
      {service.title}
    </h3>

    {/* Description — Req 10.2 */}
    <p className="text-body-sm text-text-secondary leading-relaxed flex-1">
      {service.description}
    </p>
  </GlassCard>
)

// ─── Services section ─────────────────────────────────────────────────────────

/**
 * Services section component.
 *
 * - Renders exactly one ServiceCard per entry in the services array (Req 10.1)
 * - Each ServiceCard displays icon, title, and description (Req 10.2)
 * - Responsive bento grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 (Req 10.3)
 * - Uses useScrollReveal with stagger delays for scroll animations (Req 14.x)
 */
const Services: React.FC<ServicesProps> = ({ services }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <SectionWrapper id="services">
      <div ref={sectionRef}>
        {/* Section heading */}
        <h2 className="reveal font-heading text-section text-text-primary mb-12">
          Services
        </h2>

        {/* Bento grid — one ServiceCard per service entry (Req 10.1, 10.3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`reveal reveal-delay-${(i % 4) + 1}`}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Services
