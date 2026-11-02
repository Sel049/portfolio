import React, { useState, useMemo } from 'react'
import type { Project } from '../../types'
import SectionWrapper from '../ui/SectionWrapper'
import Carousel from '../ui/Carousel'
import GlassCard from '../ui/GlassCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface ProjectsProps {
  projects: Project[]
}

// Fallback placeholder (inline SVG data URI)
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23111411'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23707770' font-size='18' font-family='sans-serif'%3ENo preview%3C/text%3E%3C/svg%3E"

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

// ─── ProjectCard ──────────────────────────────────────────────────────────────
// Req 8.5: shows title, description, tags, image, liveUrl, githubUrl
// Req 8.6: onError swaps thumbnail to fallback placeholder

interface ProjectCardProps {
  project: Project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_SRC
  }

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden">
      {/* Thumbnail — Req 8.5, 8.6 */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={project.imageSrc}
          alt={project.title}
          loading="lazy"
          width={800}
          height={450}
          onError={handleImgError}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 gap-4 p-6">
        {/* Title — Req 8.5 */}
        <h3 className="font-heading text-card text-text-primary leading-snug">
          {project.title}
        </h3>

        {/* Description — Req 8.5 */}
        <p className="text-body-sm text-text-secondary flex-1">
          {project.description}
        </p>

        {/* Tags — Req 8.5 */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-label font-body bg-bg-elevated border border-border-subtle text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links — Req 8.5 */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex items-center gap-4 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 text-body-sm font-body font-medium text-green-primary hover:text-green-secondary transition-colors"
              >
                <ExternalLinkIcon />
                Live demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 text-body-sm font-body font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                <GitHubIcon />
                View code
              </a>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

// ─── Projects section ─────────────────────────────────────────────────────────
/**
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 *
 * Category reset strategy: we use the `activeCategory` string as the `key` on
 * <Carousel>. When the key changes React remounts the component, which causes
 * useCarousel inside Carousel to reinitialise with activeIndex = 0 — satisfying
 * Req 8.4 without changing the Carousel component's public API.
 */
const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()

  // Req 8.1: derive categories from all project.categories, prepend 'All'
  const categories = useMemo((): string[] => {
    const cats = new Set<string>(['All'])
    projects.forEach(p => p.categories.forEach(c => cats.add(c)))
    return Array.from(cats)
  }, [projects])

  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Req 8.2 & 8.3: filter by active category; 'All' returns everything
  const filteredProjects = useMemo((): Project[] => {
    if (activeCategory === 'All') return projects
    return projects.filter(p => p.categories.includes(activeCategory))
  }, [projects, activeCategory])

  return (
    <SectionWrapper id="projects">
      <div ref={sectionRef}>
        {/* Section heading */}
        <h2 className="reveal font-heading text-section text-text-primary mb-4">
          Projects
        </h2>
        <p className="reveal reveal-delay-1 text-body-lg text-text-secondary mb-10 max-w-2xl">
          A selection of things I've built — from dashboards and storefronts to design
          systems and APIs.
        </p>

        {/* Category filter (Req 8.1) */}
        <div
          className="reveal reveal-delay-2 flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Project category filter"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={cat === activeCategory}
              className={[
                'focus-ring px-4 py-2 rounded-full text-body-sm font-body font-medium transition-colors border',
                cat === activeCategory
                  ? 'bg-green-primary text-bg-primary border-green-primary'
                  : 'bg-transparent text-text-secondary border-border-subtle hover:border-border-green hover:text-text-primary',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carousel — key on activeCategory resets index to 0 (Req 8.4) */}
        <div className="reveal reveal-delay-3">
          <Carousel
            key={activeCategory}
            items={filteredProjects}
            renderItem={(project) => (
              <div className="px-2 pb-4">
                <ProjectCard project={project} />
              </div>
            )}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Projects
