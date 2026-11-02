import React from 'react'
import type { ApproachEntry } from '../../types'
import Carousel from '../ui/Carousel'
import GlassCard from '../ui/GlassCard'
import SectionWrapper from '../ui/SectionWrapper'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface TestimonialsProps {
  entries: ApproachEntry[]
}

// ─── Inline SVG icons keyed by the icon name used in approach.ts ──────────────

const ApproachIcon: React.FC<{ name: string }> = ({ name }) => {
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
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    case 'git-branch':
      return (
        <svg {...props}>
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
      )
    case 'check-circle':
      return (
        <svg {...props}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    case 'trending-up':
      return (
        <svg {...props}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      )
    default:
      // Fallback: generic star/sparkle shape
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

// ─── ApproachCard ─────────────────────────────────────────────────────────────

/**
 * Renders a single approach entry with its icon, heading, and body.
 * Requirements: 11.3
 */
const ApproachCard: React.FC<{ entry: ApproachEntry }> = ({ entry }) => (
  <GlassCard className="p-8 flex flex-col gap-5 h-full mx-2">
    {/* Icon — Req 11.3 */}
    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-primary/10 text-green-primary shrink-0">
      <ApproachIcon name={entry.icon} />
    </div>

    {/* Heading — Req 11.3 */}
    <h3 className="font-heading text-card text-text-primary leading-snug">
      {entry.heading}
    </h3>

    {/* Body — Req 11.3 */}
    <p className="text-body-sm text-text-secondary leading-relaxed flex-1">
      {entry.body}
    </p>
  </GlassCard>
)

// ─── Testimonials section ─────────────────────────────────────────────────────

/**
 * Testimonials section component.
 *
 * - Section heading reads "What You Can Expect" (Req 11.1)
 * - Renders all ApproachEntry items inside the shared Carousel (Req 11.2)
 * - Each slide is an ApproachCard (Req 11.3)
 */
const Testimonials: React.FC<TestimonialsProps> = ({ entries }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <SectionWrapper id="testimonials">
      <div ref={sectionRef}>
        {/* Section heading — Req 11.1 */}
        <h2 className="reveal font-heading text-section text-text-primary mb-12">
          What You Can Expect
        </h2>

        {/* Carousel of ApproachCards — Req 11.2 */}
        <div className="reveal reveal-delay-1">
          <Carousel
            items={entries}
            renderItem={(entry) => <ApproachCard entry={entry} />}
            autoPlayInterval={5000}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Testimonials
