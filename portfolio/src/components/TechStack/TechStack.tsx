import React from 'react'
import type { TechItem } from '../../types'
import GlassCard from '../ui/GlassCard'
import SectionWrapper from '../ui/SectionWrapper'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface TechStackProps {
  items: TechItem[]
}

/**
 * Individual tech card displaying a technology icon and name.
 * The icon is rendered as a styled abbreviation using the technology's accent color.
 */
interface TechCardProps {
  item: TechItem
}

const TechCard: React.FC<TechCardProps> = ({ item }) => {
  // Derive a short 2–3 char abbreviation from the icon key for visual display
  const abbr = item.icon.slice(0, 2).toUpperCase()

  return (
    <GlassCard className="p-3 flex flex-col items-center gap-2 text-center">
      {/* Icon area — colored abbreviation acts as visual stand-in for SVG icon */}
      <span
        className="text-xl font-heading font-bold leading-none"
        style={{ color: item.color ?? '#7CFF6B' }}
        aria-hidden="true"
      >
        {abbr}
      </span>
      {/* Technology name */}
      <span className="text-xs font-body text-text-secondary leading-tight break-words w-full">
        {item.name}
      </span>
    </GlassCard>
  )
}

/**
 * TechStack section component.
 *
 * - Renders exactly one TechCard per TechItem in the items array (Req 6.1)
 * - Each TechCard displays the TechItem.name and icon (Req 6.2)
 * - Uses a responsive grid: grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 (Req 6.3)
 * - Uses useScrollReveal for staggered card reveal animations (Req 14.x)
 */
const TechStack: React.FC<TechStackProps> = ({ items }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <SectionWrapper id="tech-stack">
      <div ref={sectionRef}>
        {/* Section heading */}
        <h2 className="reveal font-heading text-section text-text-primary mb-12">
          Tech Stack
        </h2>

        {/* Responsive grid — one TechCard per TechItem */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {items.map((item, i) => (
            <div
              key={item.name}
              className={`reveal reveal-delay-${(i % 4) + 1}`}
            >
              <TechCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default TechStack
