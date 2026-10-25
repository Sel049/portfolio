import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import ProgressBar from './ProgressBar'

// ─── ProgressBar unit tests ──────────────────────────────────────────────────

describe('ProgressBar – ARIA attributes', () => {
  // Req 7.3 — progressbar role
  it('renders with role="progressbar"', () => {
    render(<ProgressBar value={50} label="Test skill" />)
    expect(screen.getByRole('progressbar')).toBeTruthy()
  })

  // Req 7.4 — value=0: correct aria attributes
  it('sets correct aria attributes for value=0', () => {
    render(<ProgressBar value={0} label="Skill level" />)
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('0')
    expect(bar.getAttribute('aria-valuemin')).toBe('0')
    expect(bar.getAttribute('aria-valuemax')).toBe('100')
    expect(bar.getAttribute('aria-label')).toBe('Skill level')
  })

  // Req 7.4 — value=50: correct aria attributes
  it('sets correct aria attributes for value=50', () => {
    render(<ProgressBar value={50} label="React" />)
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('50')
    expect(bar.getAttribute('aria-valuemin')).toBe('0')
    expect(bar.getAttribute('aria-valuemax')).toBe('100')
    expect(bar.getAttribute('aria-label')).toBe('React')
  })

  // Req 7.4 — value=100: correct aria attributes
  it('sets correct aria attributes for value=100', () => {
    render(<ProgressBar value={100} label="TypeScript" />)
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('100')
    expect(bar.getAttribute('aria-valuemin')).toBe('0')
    expect(bar.getAttribute('aria-valuemax')).toBe('100')
    expect(bar.getAttribute('aria-label')).toBe('TypeScript')
  })
})

// ─── ProgressBar property tests ──────────────────────────────────────────────

/**
 * **Validates: Requirements 7.3, 7.4**
 *
 * Property: For any integer value in [0, 100], the progressbar element must
 * have aria-valuenow equal to that value, aria-valuemin=0, aria-valuemax=100,
 * and the provided aria-label.
 */
describe('ProgressBar – property: ARIA attributes correct for any value in [0, 100]', () => {
  it('aria attributes are correctly set for any integer in [0, 100]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (value, label) => {
          const { unmount } = render(<ProgressBar value={value} label={label} />)
          const bar = screen.getByRole('progressbar')

          const valuenow = bar.getAttribute('aria-valuenow')
          const valuemin = bar.getAttribute('aria-valuemin')
          const valuemax = bar.getAttribute('aria-valuemax')
          const ariaLabel = bar.getAttribute('aria-label')

          unmount()

          return (
            valuenow === String(value) &&
            valuemin === '0' &&
            valuemax === '100' &&
            ariaLabel === label
          )
        },
      ),
      { numRuns: 200 },
    )
  })
})
