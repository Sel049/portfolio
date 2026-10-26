import React from 'react'
import type { PersonalData } from '../../types'
import GlassCard from '../ui/GlassCard'
import SectionWrapper from '../ui/SectionWrapper'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface AboutProps {
  data: PersonalData
}

/**
 * About section component.
 *
 * - Two-column layout on lg: (bio/resume left, bento grid right) (Req 5.1)
 * - Renders all bio paragraphs from PersonalData.bio (Req 5.1)
 * - ResumeButton links to PersonalData.resumeUrl with download (Req 5.3)
 * - 2×2 bento grid of GlassCard components with developer highlights (Req 5.2)
 * - useScrollReveal with stagger delays for scroll-reveal animations (Req 14.x)
 */
const About: React.FC<AboutProps> = ({ data }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  // Derive bento cards from stats data (4 stats map nicely to a 2×2 grid)
  const bentoCards = data.stats.map((stat) => ({
    value: stat.value,
    label: stat.label,
  }))

  return (
    <SectionWrapper id="about">
      <div ref={sectionRef}>
        {/* Section heading */}
        <h2 className="reveal font-heading text-section text-text-primary mb-12">
          About Me
        </h2>

        {/* Two-column layout on lg: */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ── Left column: bio + resume button ── */}
          <div className="flex flex-col gap-6">
            {/* Biography paragraphs */}
            {data.bio.map((paragraph, index) => (
              <p
                key={index}
                className={`reveal reveal-delay-${Math.min(index + 1, 4)} text-body text-text-secondary leading-relaxed`}
              >
                {paragraph}
              </p>
            ))}

            {/* Resume download button */}
            <div className="reveal reveal-delay-3 pt-2">
              <a
                href={data.resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-block py-3 px-7 rounded-lg bg-green-primary text-bg-primary font-heading font-semibold text-body hover:bg-green-secondary transition-colors duration-200"
              >
                Download Resume
              </a>
            </div>
          </div>

          {/* ── Right column: 2×2 bento grid ── */}
          <div className="grid grid-cols-2 gap-4">
            {bentoCards.map((card, index) => (
              <GlassCard
                key={card.label}
                elevated={index % 2 === 0}
                className={`reveal reveal-delay-${index + 1} p-6 flex flex-col gap-2 items-start`}
              >
                <span className="font-heading font-bold text-card text-green-primary">
                  {card.value}
                </span>
                <span className="text-body-sm text-text-secondary">
                  {card.label}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default About
