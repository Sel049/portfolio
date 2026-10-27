import React, { useState, useMemo, useEffect } from 'react'
import type { Project } from '../../types'
import { useCarousel } from '../../hooks/useCarousel'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Carousel from '../ui/Carousel'
import GlassCard from '../ui/GlassCard'
import SectionWrapper from '../ui/SectionWrapper'

// ─── Fallback placeholder (data URI) ─────────────────────────────────────────

const FALLBACK_SRC =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%23111411"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23707770">Image unavailable</text></svg>'

// ─── ProjectCard ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project
}

/**
 * Renders a single project with thumbnail, title, description, tags,
 * and optional live / GitHub links.
 *
 * Requirements: 8.5, 8.6
 */
function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, imageSrc, tags, liveUrl, githubUrl } = project

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Req 8.6 — swap to fallback on load failure
    ;(e.currentTarget as HTMLImageElement).src = FALLBACK_SRC
  }

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-t-glass bg-bg-elevated">
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-4 p-6">
        {/* Title — Req 8.5 */}
        <h3 className="font-heading font-semibold text-card text-text-primary leading-snug">
          {title}
        </h3>

        {/* Description — Req 8.5 */}
        <p className="text-body-sm text-text-secondary leading-relaxed flex-1">
          {description}
        </p>

        {/* Tags — Req 8.5 */}
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-label font-body bg-green-primary/10 text-green-primary border border-border-green"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links — Req 8.5 */}
        <div className="flex gap-3 pt-1">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-primary text-bg-primary text-body-sm font-heading font-semibold hover:bg-green-secondary transition-colors duration-200"
            >
              {/* External link icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M5.5 2.5H2.5a1 1 0 0 0-1 1V11a1 1 0 0 0 1 1H10a1 1 0 0 0 1-1V8M8 1.5h4.5m0 0V6m0-4.5L6 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-subtle text-text-secondary text-body-sm font-heading hover:border-border-green hover:text-text-primary transition-colors duration-200"
            >
              {/* GitHub icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.097-2.646 0 0 .84-.269 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.376.202 2.392.1 2.646.64.698 1.028 1.591 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

// ─── CategoryFilter ───────────────────────────────────────────────────────────

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onSelect: (category: string) => void
}

/**
 * Row of pill-style filter buttons. One is active at a time.
 *
 * Requirements: 8.1, 8.2, 8.3
 */
function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      className="flex flex-wrap gap-2"
    >
      {categories.map(category => {
        const isActive = category === activeCategory
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            aria-pressed={isActive}
            className={`focus-ring px-4 py-2 rounded-full text-body-sm font-heading font-medium transition-colors duration-200 ${
              isActive
                ? 'bg-green-primary text-bg-primary'
                : 'border border-border-subtle text-text-secondary hover:border-border-green hover:text-text-primary'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectsProps {
  projects: Project[]
}

/**
 * Projects section.
 *
 * - Derives category list from all project.categories values (Req 8.1)
 * - Filters by activeCategory (Req 8.2, 8.3)
 * - Resets carousel to index 0 when category changes (Req 8.4)
 * - Renders ProjectCard inside a Carousel (Req 8.5, 8.6)
 */
const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  // Req 8.1 — derive unique category list, always leading with 'All'
  const categories = useMemo((): string[] => {
    const cats = new Set<string>(['All'])
    projects.forEach(p => p.categories.forEach(c => cats.add(c)))
    return Array.from(cats)
  }, [projects])

  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Req 8.2, 8.3 — filter by active category
  const filteredProjects = useMemo((): Project[] => {
    if (activeCategory === 'All') return projects
    return projects.filter(p => p.categories.includes(activeCategory))
  }, [projects, activeCategory])

  // Req 8.4 — reset carousel to slide 0 whenever the filter changes
  const carousel = useCarousel(filteredProjects.length)
  useEffect(() => {
    carousel.goTo(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory])

  return (
    <SectionWrapper id="projects">
      <div ref={sectionRef}>
        {/* Section heading */}
        <h2 className="reveal font-heading text-section text-text-primary mb-4">
          Projects
        </h2>
        <p className="reveal reveal-delay-1 text-body-lg text-text-secondary mb-10 max-w-2xl">
          A selection of things I've built — from SaaS dashboards to design systems.
        </p>

        {/* Category filter — Req 8.1 */}
        <div className="reveal reveal-delay-2 mb-10">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Carousel of ProjectCards — Req 8.4, 8.5 */}
        <div className="reveal reveal-delay-3">
          {filteredProjects.length > 0 ? (
            <Carousel
              items={filteredProjects}
              renderItem={(project) => (
                <div className="px-1 pb-4">
                  <ProjectCard project={project} />
                </div>
              )}
            />
          ) : (
            <p className="text-body text-text-muted text-center py-16">
              No projects in this category yet.
            </p>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Projects
