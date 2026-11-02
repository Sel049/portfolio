import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import Services from './Services'
import { services } from '../../data/services'
import type { Service } from '../../types'

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe('Services – card rendering', () => {
  // Req 10.1 — one ServiceCard per entry
  it('renders one ServiceCard per service entry', () => {
    render(<Services services={services} />)
    services.forEach(service => {
      expect(screen.getByText(service.title, { selector: 'h3' })).toBeTruthy()
      expect(screen.getByText(service.description)).toBeTruthy()
    })
  })

  // Req 10.2 — each card displays title and description
  it('ServiceCard displays title and description', () => {
    const singleService: Service[] = [services[0]]
    render(<Services services={singleService} />)

    expect(screen.getByText(services[0].title, { selector: 'h3' })).toBeTruthy()
    expect(screen.getByText(services[0].description)).toBeTruthy()
  })

  // Section heading is present
  it('renders the "Services" section heading', () => {
    render(<Services services={services} />)
    expect(screen.getByRole('heading', { level: 2, name: /services/i })).toBeTruthy()
  })
})

// ─── Property tests ───────────────────────────────────────────────────────────

/**
 * **Validates: Requirement 10.1**
 *
 * Property: The number of rendered h3 card titles always equals the length of
 * the services array passed in, for any array of 0–12 services.
 *
 * Note: Only ServiceCard renders <h3> elements within this component.
 */
describe('Services – property: card count equals services array length', () => {
  it('rendered card count matches services array length for any input', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            icon: fc.string(),
            title: fc.string({ minLength: 1 }),
            description: fc.string(),
          }),
          { minLength: 0, maxLength: 12 },
        ),
        (testServices) => {
          const { unmount } = render(<Services services={testServices} />)

          // ServiceCard renders its title in an <h3>
          // The section heading is <h2>, so h3 count is a reliable proxy for card count
          const cards = document.querySelectorAll('h3')
          const result = cards.length === testServices.length

          unmount()
          return result
        },
      ),
      { numRuns: 50 },
    )
  })
})
