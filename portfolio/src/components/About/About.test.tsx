import { cleanup, render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { personal } from '../../data/personal'
import About from './About'

// ─── About unit tests ─────────────────────────────────────────────────────────

describe('About – bio paragraphs', () => {
  // Req 5.3 — each string in personal.bio appears in the document
  it('renders all bio paragraphs from personal data', () => {
    render(<About data={personal} />)
    for (const paragraph of personal.bio) {
      expect(screen.getByText(paragraph)).toBeTruthy()
    }
  })
})

describe('About – resume button', () => {
  // Req 5.3 — the <a> with text "Download Resume" has href equal to personal.resumeUrl
  it('resume link href matches personal.resumeUrl', () => {
    render(<About data={personal} />)
    const link = screen.getByRole('link', { name: 'Download Resume' })
    expect(link.getAttribute('href')).toBe(personal.resumeUrl)
  })
})

// ─── About property tests ─────────────────────────────────────────────────────

/**
 * **Validates: Requirements 5.3**
 *
 * Property: For any array of non-empty, non-whitespace-padded bio strings,
 * rendering About with that bio array causes every paragraph to appear in the document.
 */
describe('About – property: all bio paragraphs appear for any bio array', () => {
  it('every generated bio paragraph is rendered in the document', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1, maxLength: 80 })
            .filter((s) => s.trim().length > 0 && s === s.trim()),
          { minLength: 1, maxLength: 5 },
        ),
        (generatedBio) => {
          const { container } = render(<About data={{ ...personal, bio: generatedBio }} />)

          // Use scoped container queries to avoid cross-iteration DOM leaks
          const allPresent = generatedBio.every((paragraph) => {
            return Array.from(container.querySelectorAll('p')).some(
              (el) => el.textContent === paragraph
            )
          })

          cleanup()
          return allPresent
        },
      ),
      { numRuns: 100 },
    )
  })
})
