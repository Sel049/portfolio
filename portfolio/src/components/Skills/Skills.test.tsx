import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { skills } from '../../data/skills'
import Skills from './Skills'

// ─── Skills unit tests ────────────────────────────────────────────────────────

describe('Skills – category headings', () => {
  // Req 7.1 — each category title renders as an <h3> heading
  it('renders each skill category title as an h3 heading', () => {
    render(<Skills categories={skills} />)
    for (const category of skills) {
      const heading = screen.getByRole('heading', { level: 3, name: category.title })
      expect(heading).toBeTruthy()
    }
  })
})

describe('Skills – ProgressBar ARIA', () => {
  // Req 7.3 — progressbar elements count matches total skill entries
  it('renders one progressbar per skill entry across all categories', () => {
    render(<Skills categories={skills} />)
    const totalSkills = skills.reduce((sum, cat) => sum + cat.skills.length, 0)
    const progressbars = screen.getAllByRole('progressbar')
    expect(progressbars.length).toBe(totalSkills)
  })
})

describe('Skills – skill names', () => {
  // Each skill name appears in the document
  it('renders every skill name from all categories', () => {
    render(<Skills categories={skills} />)
    for (const category of skills) {
      for (const skill of category.skills) {
        expect(screen.getByText(skill.name)).toBeTruthy()
      }
    }
  })
})
