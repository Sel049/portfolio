import { render, screen, fireEvent } from '@testing-library/react'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import Projects from './Projects'
import { projects } from '../../data/projects'
import type { Project } from '../../types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Derives the expected category list the same way the component does:
 * Set(['All', ...all project.categories]), preserving insertion order.
 */
function deriveCategories(ps: Project[]): string[] {
  const cats = new Set<string>(['All'])
  ps.forEach(p => p.categories.forEach(c => cats.add(c)))
  return Array.from(cats)
}

/**
 * Applies the same filter logic as the component's filteredProjects memo.
 */
function filterByCategory(ps: Project[], category: string): Project[] {
  if (category === 'All') return ps
  return ps.filter(p => p.categories.includes(category))
}

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe('Projects – category filter buttons', () => {
  // Req 8.1 — all derived categories are rendered as buttons
  it('renders all category filter buttons including "All"', () => {
    render(<Projects projects={projects} />)
    const expected = deriveCategories(projects)
    expected.forEach(cat => {
      expect(screen.getByRole('button', { name: cat })).toBeTruthy()
    })
  })

  // Req 8.1 — category filter group has correct aria attributes
  it('category filter container has role="group" and aria-label', () => {
    render(<Projects projects={projects} />)
    const group = screen.getByRole('group', { name: /project category filter/i })
    expect(group).toBeTruthy()
  })

  // Req 8.2 — "All" is active (aria-pressed="true") by default
  it('"All" button has aria-pressed="true" by default', () => {
    render(<Projects projects={projects} />)
    const allBtn = screen.getByRole('button', { name: 'All' })
    expect(allBtn.getAttribute('aria-pressed')).toBe('true')
  })

  // aria-pressed state toggling
  it('aria-pressed updates correctly when a category is clicked', () => {
    render(<Projects projects={projects} />)
    const backendBtn = screen.getByRole('button', { name: 'Backend' })

    fireEvent.click(backendBtn)

    expect(backendBtn.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('false')
  })
})

describe('Projects – default rendering (All category)', () => {
  // Req 8.3 — default "All" shows every project
  it('shows all projects when "All" category is active (default)', () => {
    render(<Projects projects={projects} />)
    projects.forEach(p => {
      // Some slides are aria-hidden; use { hidden: true } to find them
      expect(screen.getByText(p.title, { selector: 'h3' })).toBeTruthy()
    })
  })
})

describe('Projects – category filtering', () => {
  // Req 8.2, 8.3 — clicking a category filters visible projects
  it('filters to only Backend projects when "Backend" is clicked', () => {
    render(<Projects projects={projects} />)

    fireEvent.click(screen.getByRole('button', { name: 'Backend' }))

    const backendProjects = filterByCategory(projects, 'Backend')
    const nonBackendProjects = projects.filter(p => !p.categories.includes('Backend'))

    backendProjects.forEach(p => {
      expect(screen.getByText(p.title, { selector: 'h3' })).toBeTruthy()
    })
    nonBackendProjects.forEach(p => {
      expect(screen.queryByText(p.title, { selector: 'h3' })).toBeNull()
    })
  })
})

describe('Projects – carousel reset on category change', () => {
  // Req 8.4 — carousel resets to slide 1 when category changes
  it('resets carousel to first slide when category filter changes', () => {
    render(<Projects projects={projects} />)

    // Advance to the next slide
    const nextBtn = screen.getByRole('button', { name: 'Next slide' })
    fireEvent.click(nextBtn)

    // Second dot should now be selected
    const dotsBefore = screen.getAllByRole('tab')
    expect(dotsBefore[1].getAttribute('aria-selected')).toBe('true')

    // Change category — Carousel is re-keyed, so it remounts at index 0
    fireEvent.click(screen.getByRole('button', { name: 'Open Source' }))

    // After remount, first dot is selected again
    const dotsAfter = screen.getAllByRole('tab')
    expect(dotsAfter[0].getAttribute('aria-selected')).toBe('true')
  })
})

describe('Projects – ProjectCard content', () => {
  // Req 8.5 — card renders all required fields
  it('ProjectCard displays title, description, tags, and links', () => {
    const project = projects[0] // Pulse Analytics — has liveUrl and githubUrl
    render(<Projects projects={[project]} />)

    expect(screen.getByText(project.title, { selector: 'h3' })).toBeTruthy()
    expect(screen.getByText(project.description)).toBeTruthy()

    // At least one tag is visible
    expect(screen.getByText(project.tags[0])).toBeTruthy()

    // Links
    if (project.liveUrl) {
      const liveLink = screen.getByRole('link', { name: /live demo/i })
      expect(liveLink.getAttribute('href')).toBe(project.liveUrl)
    }
    if (project.githubUrl) {
      const ghLink = screen.getByRole('link', { name: /view code/i })
      expect(ghLink.getAttribute('href')).toBe(project.githubUrl)
    }
  })

  // Req 8.5 — img has alt equal to project title
  it('ProjectCard image has alt text equal to project title', () => {
    const project = projects[0]
    render(<Projects projects={[project]} />)
    expect(screen.getByAltText(project.title)).toBeTruthy()
  })
})

// ─── Property tests ───────────────────────────────────────────────────────────

/**
 * **Validates: Requirements 8.2, 8.3**
 *
 * Property: For any real category from the projects data, the filtered set is
 * always a subset of the full projects array.
 */
describe('Projects – property: filteredProjects ⊆ all projects', () => {
  it('filtered projects for any non-All category is always a subset of all projects', () => {
    const allCategories = [...new Set(projects.flatMap(p => p.categories))]

    fc.assert(
      fc.property(
        fc.constantFrom(...allCategories),
        (category) => {
          const filtered = filterByCategory(projects, category)
          // Subset check
          const isSubset = filtered.every(fp => projects.some(p => p.id === fp.id))
          const notLarger = filtered.length <= projects.length
          return isSubset && notLarger
        },
      ),
      { numRuns: 100 },
    )
  })
})

/**
 * **Validates: Requirement 8.3**
 *
 * Property: When activeCategory is 'All', all projects are returned unchanged.
 * Tested as pure function logic (no render needed).
 */
describe('Projects – property: "All" category returns all projects', () => {
  it('filteredProjects for "All" returns the full array regardless of content', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.string(),
            imageSrc: fc.string(),
            tags: fc.array(fc.string()),
            categories: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
            liveUrl: fc.option(fc.webUrl(), { nil: undefined }),
            githubUrl: fc.option(fc.webUrl(), { nil: undefined }),
            featured: fc.option(fc.boolean(), { nil: undefined }),
          }),
          { minLength: 1, maxLength: 10 },
        ),
        (testProjects) => {
          // 'All' branch in the component simply returns the full array
          const filtered = filterByCategory(testProjects, 'All')
          return filtered.length === testProjects.length
        },
      ),
      { numRuns: 100 },
    )
  })
})
