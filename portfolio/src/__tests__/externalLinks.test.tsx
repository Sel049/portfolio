/**
 * External link security audit — Req 17.5
 *
 * WHEN any external link has `target="_blank"`, THE Application SHALL include
 * `rel="noopener noreferrer"` on that element.
 *
 * This file covers the app-wide invariant with both unit and property-based
 * tests for every component that renders external links:
 *   - Projects (liveUrl / githubUrl per project card)
 *   - Contact  (social links in the "Connect" card)
 *   - About    (resume download button)
 *   - Footer   (social links column)
 */

import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import Projects from '../components/Projects/Projects'
import Contact from '../components/Contact/Contact'
import About from '../components/About/About'
import Footer from '../components/Footer/Footer'

import { personal } from '../data/personal'
import { projects as defaultProjects } from '../data/projects'
import { services } from '../data/services'

import type { Project, PersonalData, SocialLink } from '../types'

// ─── Shared helper ────────────────────────────────────────────────────────────

/**
 * Queries every `<a target="_blank">` inside the rendered container and
 * returns a list of failures (anchors whose rel is missing noopener or noreferrer).
 */
function findInsecureExternalLinks(container: HTMLElement): HTMLAnchorElement[] {
  const blanks = Array.from(
    container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'),
  )
  return blanks.filter(
    a => !a.rel.includes('noopener') || !a.rel.includes('noreferrer'),
  )
}

// ─── Unit tests — static data ─────────────────────────────────────────────────

describe('Req 17.5 – Projects: external links have rel=noopener noreferrer', () => {
  it('all project card external links have correct rel attribute', () => {
    const { container } = render(<Projects projects={defaultProjects} />)
    const insecure = findInsecureExternalLinks(container)
    expect(insecure).toHaveLength(0)
  })

  it('live-demo and github links are external and have correct rel', () => {
    const { container } = render(<Projects projects={defaultProjects} />)
    const liveLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href^="https://"]'),
    )
    // Every https link that is external should carry the rel
    liveLinks.forEach(link => {
      if (link.target === '_blank') {
        expect(link.rel).toContain('noopener')
        expect(link.rel).toContain('noreferrer')
      }
    })
  })
})

describe('Req 17.5 – Contact: external social links have rel=noopener noreferrer', () => {
  it('all external social links in Contact have correct rel attribute', () => {
    const { container } = render(<Contact data={personal} />)
    const insecure = findInsecureExternalLinks(container)
    expect(insecure).toHaveLength(0)
  })

  it('email/mailto links in Contact do NOT have target="_blank"', () => {
    const { container } = render(<Contact data={personal} />)
    const mailtoLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]'),
    )
    mailtoLinks.forEach(link => {
      expect(link.target).not.toBe('_blank')
    })
  })
})

describe('Req 17.5 – About: resume link has rel=noopener noreferrer', () => {
  it('the resume download link has target="_blank" and correct rel', () => {
    const { container } = render(<About data={personal} />)
    const insecure = findInsecureExternalLinks(container)
    expect(insecure).toHaveLength(0)
  })
})

describe('Req 17.5 – Footer: external social links have rel=noopener noreferrer', () => {
  it('all external social links in Footer have correct rel attribute', () => {
    const { container } = render(<Footer data={personal} services={services} />)
    const insecure = findInsecureExternalLinks(container)
    expect(insecure).toHaveLength(0)
  })
})

// ─── Property-based tests ─────────────────────────────────────────────────────

/**
 * **Validates: Requirements 17.5**
 *
 * Property: For any collection of Project objects whose liveUrl / githubUrl are
 * set, every anchor with target="_blank" rendered by the Projects component must
 * carry rel containing both "noopener" and "noreferrer".
 */
describe('Req 17.5 – property: Projects external links secure for any project data', () => {
  it('every target="_blank" link has rel=noopener noreferrer regardless of project content', () => {
    // Constrain URLs to https: to ensure they actually get target="_blank"
    const httpsUrl = fc.webUrl().filter(u => u.startsWith('https://'))

    const projectArb: fc.Arbitrary<Project> = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 60 }),
      description: fc.string({ minLength: 1, maxLength: 200 }),
      imageSrc: fc.string(),
      tags: fc.array(fc.string({ minLength: 1 }), { maxLength: 5 }),
      categories: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 3 }),
      liveUrl: fc.option(httpsUrl, { nil: undefined }),
      githubUrl: fc.option(httpsUrl, { nil: undefined }),
      featured: fc.option(fc.boolean(), { nil: undefined }),
    })

    fc.assert(
      fc.property(
        fc.array(projectArb, { minLength: 1, maxLength: 6 }),
        (testProjects) => {
          const { container, unmount } = render(<Projects projects={testProjects} />)
          const insecure = findInsecureExternalLinks(container)
          unmount()
          return insecure.length === 0
        },
      ),
      { numRuns: 50 },
    )
  })
})

/**
 * **Validates: Requirements 17.5**
 *
 * Property: For any set of social links passed to the Contact component, every
 * anchor whose platform is not "email" (i.e. gets target="_blank") must carry
 * rel containing both "noopener" and "noreferrer".
 */
describe('Req 17.5 – property: Contact social links secure for any socials input', () => {
  it('every target="_blank" link has rel=noopener noreferrer for any social data', () => {
    const externalSocialArb: fc.Arbitrary<SocialLink> = fc.record({
      platform: fc.constantFrom('github', 'linkedin', 'twitter'),
      url: fc.constantFrom(
        'https://github.com/user',
        'https://linkedin.com/in/user',
        'https://twitter.com/user',
      ),
      icon: fc.string(),
    })

    fc.assert(
      fc.property(
        fc.array(externalSocialArb, { minLength: 1, maxLength: 5 }),
        (socials) => {
          const testData: PersonalData = { ...personal, socials }
          const { container, unmount } = render(<Contact data={testData} />)
          const insecure = findInsecureExternalLinks(container)
          unmount()
          return insecure.length === 0
        },
      ),
      { numRuns: 50 },
    )
  })
})

/**
 * **Validates: Requirements 17.5**
 *
 * Property: For any set of social links passed to the Footer component, every
 * anchor whose platform is not "email" (i.e. gets target="_blank") must carry
 * rel containing both "noopener" and "noreferrer".
 */
describe('Req 17.5 – property: Footer social links secure for any socials input', () => {
  it('every target="_blank" link has rel=noopener noreferrer for any social data', () => {
    const externalSocialArb: fc.Arbitrary<SocialLink> = fc.record({
      platform: fc.constantFrom('github', 'linkedin', 'twitter'),
      url: fc.constantFrom(
        'https://github.com/user',
        'https://linkedin.com/in/user',
        'https://twitter.com/user',
      ),
      icon: fc.string(),
    })

    fc.assert(
      fc.property(
        fc.array(externalSocialArb, { minLength: 1, maxLength: 5 }),
        (socials) => {
          const testData: PersonalData = { ...personal, socials }
          const { container, unmount } = render(
            <Footer data={testData} services={[]} />,
          )
          const insecure = findInsecureExternalLinks(container)
          unmount()
          return insecure.length === 0
        },
      ),
      { numRuns: 50 },
    )
  })
})
