import React from 'react'
import type { PersonalData } from '../../types'
import GreenBadge from '../ui/GreenBadge'
import SectionWrapper from '../ui/SectionWrapper'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface HeroProps {
  data: PersonalData
}

/**
 * Hero section component.
 *
 * - Two-column grid layout on large screens (Req 4.2)
 * - Single <h1> for the developer's name (Req 4.1)
 * - Status badge, tagline, description, CTA buttons, and stats row in left col (Req 4.2)
 * - Portrait in right column with onError fallback (Req 4.4)
 * - Green radial ambient glow decorative element (Req 4.5)
 * - Stats row renders all Stat entries from PersonalData.stats (Req 4.3)
 */
const Hero: React.FC<HeroProps> = ({ data }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  const handlePortraitError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/assets/portrait-placeholder.webp'
  }

  return (
    <SectionWrapper id="hero">
      <div
        ref={sectionRef}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* ── Left column ── */}
        <div className="flex flex-col gap-6">
          {/* Status badge */}
          <div className="reveal">
            <GreenBadge>Available for work</GreenBadge>
          </div>

          {/* Developer name — sole <h1> on the page (Req 4.1) */}
          <h1 className="reveal reveal-delay-1 font-heading text-hero text-text-primary">
            {data.name}
          </h1>

          {/* Title / tagline */}
          <p className="reveal reveal-delay-2 text-body-lg text-green-primary font-heading font-medium">
            {data.title}
          </p>

          {/* Description */}
          <p className="reveal reveal-delay-2 text-body text-text-secondary max-w-lg">
            {data.tagline}
          </p>

          {/* CTA buttons */}
          <div className="reveal reveal-delay-3 flex flex-wrap gap-4">
            {/* Primary CTA — links to #contact */}
            <a
              href="#contact"
              className="focus-ring inline-block py-3 px-7 rounded-lg bg-green-primary text-bg-primary font-heading font-semibold text-body hover:bg-green-secondary transition-colors duration-200"
            >
              Get in Touch
            </a>

            {/* Secondary CTA — links to #projects */}
            <a
              href="#projects"
              className="focus-ring inline-block py-3 px-7 rounded-lg border border-border-green text-green-primary font-heading font-semibold text-body hover:bg-green-primary/10 transition-colors duration-200"
            >
              View Projects
            </a>
          </div>

          {/* Stats row (Req 4.3) */}
          <div className="reveal reveal-delay-4 flex flex-wrap gap-8 pt-2">
            {data.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="font-heading font-bold text-card text-text-primary">
                  {stat.value}
                </span>
                <span className="text-label text-text-muted uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="reveal flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm lg:max-w-md">
            {/* Ambient glow decorative element (Req 4.5) */}
            <div
              className="ambient-glow w-[120%] h-[120%] -top-[10%] -left-[10%]"
              aria-hidden="true"
            />

            {/* Developer portrait (Req 4.4) */}
            <img
              src={data.portraitSrc}
              alt={`Portrait of ${data.name}`}
              width={480}
              height={480}
              loading="eager"
              onError={handlePortraitError}
              className="relative z-10 w-full h-auto rounded-glass-lg object-cover shadow-green-glow-lg"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Hero
