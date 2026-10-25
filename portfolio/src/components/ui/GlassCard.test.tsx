import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GlassCard from './GlassCard'

// ─── GlassCard unit tests ─────────────────────────────────────────────────────

describe('GlassCard – children', () => {
  // Req 9.2 — renders children correctly
  it('renders children correctly', () => {
    render(
      <GlassCard>
        <span>Hello world</span>
      </GlassCard>,
    )
    expect(screen.getByText('Hello world')).toBeTruthy()
  })

  it('renders multiple children', () => {
    render(
      <GlassCard>
        <p>First</p>
        <p>Second</p>
      </GlassCard>,
    )
    expect(screen.getByText('First')).toBeTruthy()
    expect(screen.getByText('Second')).toBeTruthy()
  })
})

describe('GlassCard – elevated class', () => {
  // Req 9.2 — without elevated prop: applies "glass" base class, not "glass-elevated"
  it('applies "glass" class when elevated is not set', () => {
    render(<GlassCard><span>content</span></GlassCard>)
    const card = screen.getByText('content').parentElement!
    expect(card.className).toContain('glass')
    expect(card.className).not.toContain('glass-elevated')
  })

  // Req 9.2 — without elevated prop (explicit false): no "glass-elevated" class
  it('does not apply "glass-elevated" class when elevated={false}', () => {
    render(<GlassCard elevated={false}><span>content</span></GlassCard>)
    const card = screen.getByText('content').parentElement!
    expect(card.className).not.toContain('glass-elevated')
  })

  // Req 9.2 — with elevated={true}: applies "glass-elevated" class
  it('applies "glass-elevated" class when elevated={true}', () => {
    render(<GlassCard elevated><span>content</span></GlassCard>)
    const card = screen.getByText('content').parentElement!
    expect(card.className).toContain('glass-elevated')
  })

  // Additional className prop is passed through
  it('appends extra className when provided', () => {
    render(<GlassCard className="p-4"><span>content</span></GlassCard>)
    const card = screen.getByText('content').parentElement!
    expect(card.className).toContain('p-4')
  })
})
