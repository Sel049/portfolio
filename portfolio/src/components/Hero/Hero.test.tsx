import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { personal } from '../../data/personal'
import Hero from './Hero'

// ─── Hero unit tests ──────────────────────────────────────────────────────────

describe('Hero – heading', () => {
  // Req 4.1 — <h1> contains the developer's name
  it('renders an <h1> containing the developer name from personal data', () => {
    render(<Hero data={personal} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain(personal.name)
  })
})

describe('Hero – stats', () => {
  // Req 4.3 — All stats from PersonalData.stats are visible
  it('renders the value for every stat', () => {
    render(<Hero data={personal} />)
    for (const stat of personal.stats) {
      expect(screen.getByText(stat.value)).toBeTruthy()
    }
  })

  it('renders the label for every stat', () => {
    render(<Hero data={personal} />)
    for (const stat of personal.stats) {
      expect(screen.getByText(stat.label)).toBeTruthy()
    }
  })
})

describe('Hero – portrait', () => {
  // Req 4.4 — Portrait <img> has a valid src initially
  it('portrait img has a src attribute matching portraitSrc', () => {
    render(<Hero data={personal} />)
    const img = screen.getByRole('img', { name: `Portrait of ${personal.name}` })
    expect(img.getAttribute('src')).toBe(personal.portraitSrc)
  })

  // Req 4.4 — Portrait src changes to fallback on error
  it('portrait src changes to fallback when an error occurs', () => {
    render(<Hero data={personal} />)
    const img = screen.getByRole('img', { name: `Portrait of ${personal.name}` }) as HTMLImageElement

    // Simulate a broken image
    fireEvent.error(img)

    expect(img.src).toContain('/assets/portrait-placeholder.webp')
  })
})
