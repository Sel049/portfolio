import { cleanup, render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { techStack } from '../../data/techStack'
import TechStack from './TechStack'

// ─── TechStack unit tests ─────────────────────────────────────────────────────

describe('TechStack – item names', () => {
  // Req 6.2 — each card shows name for the real techStack data
  it('renders every tech item name from the real techStack data', () => {
    render(<TechStack items={techStack} />)
    for (const item of techStack) {
      expect(screen.getByText(item.name)).toBeTruthy()
    }
  })
})

// ─── TechStack property tests ─────────────────────────────────────────────────

/**
 * **Validates: Requirements 6.1**
 *
 * Property: For any array of TechItem objects with unique names, the number of
 * rendered tech name elements equals the array length.
 */
describe('TechStack – property: card count equals item array length', () => {
  it('renders exactly one name element per item in the array', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 })
              .filter((s) => s.trim().length > 0 && s === s.trim()),
            icon: fc.string({ minLength: 1, maxLength: 10 }),
          }),
          { minLength: 1, maxLength: 10 },
        ).filter((items) => {
          // Ensure unique names to avoid ambiguity when querying
          const names = items.map((i) => i.name)
          return new Set(names).size === names.length
        }),
        (generatedItems) => {
          const { container } = render(<TechStack items={generatedItems} />)

          // Use scoped container queries to avoid cross-iteration DOM leaks
          const allFound = generatedItems.every((item) => {
            return container.querySelector(`span.text-xs`) !== null &&
              Array.from(container.querySelectorAll('span.text-xs')).some(
                (el) => el.textContent === item.name
              )
          })

          cleanup()
          return allFound
        },
      ),
      { numRuns: 100 },
    )
  })
})
