import React from 'react'
import type { SkillCategory, SkillEntry } from '../../types'
import GlassCard from '../ui/GlassCard'
import ProgressBar from '../ui/ProgressBar'
import SectionWrapper from '../ui/SectionWrapper'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface SkillsProps {
  categories: SkillCategory[]
}

/**
 * Renders a single skill entry with its name, proficiency label, and progress bar.
 * Requirements: 7.3, 7.4, 7.5
 */
const SkillItem: React.FC<{ skill: SkillEntry }> = ({ skill }) => (
  <li className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <span className="text-body-sm font-body font-medium text-text-primary">
        {skill.name}
      </span>
      <span className="text-label font-body text-text-muted uppercase tracking-widest">
        {skill.proficiency}
      </span>
    </div>
    <ProgressBar value={skill.level} label={skill.name} animate />
  </li>
)

/**
 * Renders a single skill category in a GlassCard with a list of SkillItem components.
 * Requirements: 7.1, 7.2
 */
const SkillCategoryCard: React.FC<{ category: SkillCategory; delayClass: string }> = ({
  category,
  delayClass,
}) => (
  <div className={`reveal ${delayClass}`}>
    <GlassCard className="p-6 h-full flex flex-col gap-6">
      <h3 className="font-heading text-card text-text-primary">{category.title}</h3>
      <ul className="flex flex-col gap-4">
        {category.skills.map(skill => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </ul>
    </GlassCard>
  </div>
)

/**
 * Skills section component.
 *
 * - Renders all SkillEntry items grouped under their SkillCategory titles (Req 7.1)
 * - Three-column grid: grid-cols-1 md:grid-cols-3 (Req 7.2)
 * - Each category rendered inside a GlassCard (Req 7.2)
 * - Each SkillEntry uses ProgressBar with correct ARIA attributes (Req 7.3, 7.4, 7.5)
 * - Uses useScrollReveal for staggered card reveal animations (Req 14.x)
 */
const Skills: React.FC<SkillsProps> = ({ categories }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  return (
    <SectionWrapper id="skills">
      <div ref={sectionRef}>
        {/* Section heading */}
        <h2 className="reveal font-heading text-section text-text-primary mb-12">
          Skills
        </h2>

        {/* Three-column grid — one GlassCard per SkillCategory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, i) => (
            <SkillCategoryCard
              key={category.title}
              category={category}
              delayClass={`reveal-delay-${(i % 4) + 1}`}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Skills
