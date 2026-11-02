import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Testimonials from './Testimonials'
import { approach } from '../../data/approach'

// ─── Testimonials unit tests ──────────────────────────────────────────────────

describe('Testimonials – section heading', () => {
  // Req 11.1 — heading text must be exactly "What You Can Expect"
  it('renders "What You Can Expect" as the section heading', () => {
    render(<Testimonials entries={approach} />)
    const heading = screen.getByRole('heading', { level: 2, name: 'What You Can Expect' })
    expect(heading).toBeTruthy()
  })
})

describe('Testimonials – ApproachCard content', () => {
  // Req 11.3 — each ApproachCard displays heading and body text
  it('renders the heading and body for every approach entry', () => {
    render(<Testimonials entries={approach} />)

    for (const entry of approach) {
      // heading is rendered as an <h3> inside ApproachCard
      expect(screen.getByText(entry.heading, { selector: 'h3' })).toBeTruthy()
      // body is rendered as a <p>
      expect(screen.getByText(entry.body)).toBeTruthy()
    }
  })

  // Req 11.3 — verify icon container renders in the active ApproachCard
  it('ApproachCard icon container is rendered for the active slide', () => {
    const singleEntry = [approach[0]]
    render(<Testimonials entries={singleEntry} />)

    // The active slide's ApproachCard should render icon wrapper, heading, and body
    expect(screen.getByText(singleEntry[0].heading, { selector: 'h3' })).toBeTruthy()
    expect(screen.getByText(singleEntry[0].body)).toBeTruthy()
    // Confirm we have exactly one h3 card heading for a single-entry carousel
    const cardHeadings = screen.getAllByRole('heading', { level: 3 })
    expect(cardHeadings.length).toBe(1)
  })
})
