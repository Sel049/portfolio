import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'
import { personal } from '../../data/personal'
import { services } from '../../data/services'
import type { PersonalData, Service, SocialLink } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderFooter = (data: PersonalData = personal, serviceList: Service[] = services) =>
  render(<Footer data={data} services={serviceList} />)

// ─── Unit tests ───────────────────────────────────────────────────────────────

/**
 * Requirements 13.1 — social link entries rendered (platform name + URL)
 */
describe('Footer – Req 13.1: social links rendered', () => {
  it('renders every social platform name from PersonalData.socials', () => {
    renderFooter()
    personal.socials.forEach(social => {
      // platform name appears in the anchor text (capitalised)
      const links = screen.getAllByRole('link', {
        name: new RegExp(social.platform, 'i'),
      })
      expect(links.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('social links point to the correct URLs', () => {
    renderFooter()
    personal.socials.forEach(social => {
      const links = screen.getAllByRole('link', {
        name: new RegExp(social.platform, 'i'),
      })
      const hasCorrectHref = links.some(
        (link) => (link as HTMLAnchorElement).href === social.url ||
                  // mailto: links are reconstructed by jsdom
                  (link as HTMLAnchorElement).getAttribute('href') === social.url
      )
      expect(hasCorrectHref).toBe(true)
    })
  })
})

/**
 * Requirements 13.2 — service-name links from services data array
 */
describe('Footer – Req 13.2: services links rendered', () => {
  it('renders every service title as a link', () => {
    renderFooter()
    services.forEach(service => {
      expect(screen.getByRole('link', { name: service.title })).toBeTruthy()
    })
  })

  it('all service links are present in the footer', () => {
    renderFooter()
    services.forEach(service => {
      const link = screen.getByRole('link', { name: service.title }) as HTMLAnchorElement
      expect(link).toBeTruthy()
    })
  })
})

/**
 * Requirements 13.3 — rel="noopener noreferrer" on target="_blank" links
 */
describe('Footer – Req 13.3: rel=noopener noreferrer on external links', () => {
  it('all target="_blank" links have rel="noopener noreferrer"', () => {
    const { container } = renderFooter()
    const externalLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')
    )
    // There must be at least one external link (non-email socials)
    expect(externalLinks.length).toBeGreaterThan(0)

    externalLinks.forEach(link => {
      expect(link.rel).toContain('noopener')
      expect(link.rel).toContain('noreferrer')
    })
  })

  it('non-external links (mailto) do not have target="_blank"', () => {
    const { container } = renderFooter()
    const mailtoLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]')
    )
    mailtoLinks.forEach(link => {
      expect(link.target).not.toBe('_blank')
    })
  })

  it('GitHub social link is external and has correct rel', () => {
    const { container } = renderFooter()
    const githubSocial = personal.socials.find(s => s.platform === 'github')!
    const links = Array.from(
      container.querySelectorAll<HTMLAnchorElement>(`a[href="${githubSocial.url}"]`)
    )
    const externalGithub = links.find(l => l.target === '_blank')
    expect(externalGithub).toBeDefined()
    expect(externalGithub!.rel).toContain('noopener')
    expect(externalGithub!.rel).toContain('noreferrer')
  })
})

/**
 * General structure checks
 */
describe('Footer – structure', () => {
  it('renders developer name', () => {
    renderFooter()
    expect(screen.getByText(personal.name)).toBeTruthy()
  })

  it('renders developer location', () => {
    renderFooter()
    expect(screen.getByText(personal.location)).toBeTruthy()
  })

  it('renders footer element with accessible label', () => {
    const { container } = renderFooter()
    const footer = container.querySelector('footer[aria-label]')
    expect(footer).not.toBeNull()
  })

  it('renders copyright text with current year', () => {
    renderFooter()
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeTruthy()
  })
})

// ─── Property-based tests ─────────────────────────────────────────────────────

/**
 * **Validates: Requirements 13.1**
 *
 * Property: For any array of SocialLink objects, every platform name is
 * rendered somewhere in the footer.
 */
describe('Footer – property Req 13.1: all social platforms rendered', () => {
  it('renders all social platform names for any socials array', () => {
    const platformArb = fc.constantFrom('github', 'linkedin', 'twitter', 'email', 'custom')
    const socialArb: fc.Arbitrary<SocialLink> = fc.record({
      platform: platformArb,
      url: fc.oneof(
        fc.constant('https://github.com/user'),
        fc.constant('https://linkedin.com/in/user'),
        fc.constant('mailto:user@example.com'),
      ),
      icon: platformArb,
    })

    fc.assert(
      fc.property(
        fc.uniqueArray(socialArb, { selector: s => s.platform, minLength: 1, maxLength: 5 }),
        (socials) => {
          const testData: PersonalData = { ...personal, socials }
          const { container, unmount } = render(<Footer data={testData} services={[]} />)

          const allRendered = socials.every(social => {
            const text = container.textContent ?? ''
            return text.toLowerCase().includes(social.platform.toLowerCase())
          })

          unmount()
          return allRendered
        }
      ),
      { numRuns: 50 }
    )
  })
})

/**
 * **Validates: Requirements 13.2**
 *
 * Property: For any array of Service objects, every service title appears as a
 * link in the footer.
 */
describe('Footer – property Req 13.2: all service titles rendered as links', () => {
  it('renders all service titles as links for any services array', () => {
    const serviceArb: fc.Arbitrary<Service> = fc.record({
      icon: fc.string(),
      title: fc.string({ minLength: 1, maxLength: 40 })
        .filter(s => s.trim().length > 0),
      description: fc.string(),
    })

    fc.assert(
      fc.property(
        fc.array(serviceArb, { minLength: 0, maxLength: 8 }),
        (testServices) => {
          const { container, unmount } = render(
            <Footer data={personal} services={testServices} />
          )

          const allRendered = testServices.every(service => {
            const links = Array.from(container.querySelectorAll('a'))
            return links.some(link => link.textContent?.trim() === service.title.trim())
          })

          unmount()
          return allRendered
        }
      ),
      { numRuns: 50 }
    )
  })
})

/**
 * **Validates: Requirements 13.3**
 *
 * Property: For any set of social links, every anchor with target="_blank" has
 * rel containing "noopener" and "noreferrer" — no external link is missing the
 * security attribute.
 */
describe('Footer – property Req 13.3: all target="_blank" links have rel=noopener noreferrer', () => {
  it('every external link has correct rel for any socials input', () => {
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
            <Footer data={testData} services={[]} />
          )

          const externalLinks = Array.from(
            container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')
          )

          const allSecure = externalLinks.every(
            link => link.rel.includes('noopener') && link.rel.includes('noreferrer')
          )

          unmount()
          return allSecure
        }
      ),
      { numRuns: 50 }
    )
  })
})
