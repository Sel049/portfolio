import { render, screen, fireEvent } from '@testing-library/react'
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import Carousel from './Carousel'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => `Slide ${i + 1}`)

const renderItem = (item: string) => <div>{item}</div>

// ─── Carousel unit tests ─────────────────────────────────────────────────────

describe('Carousel – navigation button aria-labels', () => {
  // Req 9.2 — prev button has correct aria-label
  it('previous slide button has aria-label="Previous slide"', () => {
    render(<Carousel items={makeItems(3)} renderItem={renderItem} />)
    const btn = screen.getByRole('button', { name: 'Previous slide' })
    expect(btn).toBeTruthy()
    expect(btn.getAttribute('aria-label')).toBe('Previous slide')
  })

  // Req 9.2 — next button has correct aria-label
  it('next slide button has aria-label="Next slide"', () => {
    render(<Carousel items={makeItems(3)} renderItem={renderItem} />)
    const btn = screen.getByRole('button', { name: 'Next slide' })
    expect(btn).toBeTruthy()
    expect(btn.getAttribute('aria-label')).toBe('Next slide')
  })
})

describe('Carousel – dot indicator aria-selected', () => {
  // Req 9.3 — first dot is selected on mount
  it('first dot has aria-selected="true" on mount, others are false', () => {
    render(<Carousel items={makeItems(3)} renderItem={renderItem} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[1].getAttribute('aria-selected')).toBe('false')
    expect(tabs[2].getAttribute('aria-selected')).toBe('false')
  })

  // Req 9.3 — after clicking next, second dot becomes selected
  it('second dot becomes aria-selected="true" after clicking Next slide', () => {
    render(<Carousel items={makeItems(3)} renderItem={renderItem} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))

    const tabs = screen.getAllByRole('tab')
    expect(tabs[0].getAttribute('aria-selected')).toBe('false')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(tabs[2].getAttribute('aria-selected')).toBe('false')
  })

  // Req 9.3 — clicking a dot directly selects it
  it('clicking a dot selects that dot', () => {
    render(<Carousel items={makeItems(4)} renderItem={renderItem} />)
    const tabs = screen.getAllByRole('tab')

    fireEvent.click(tabs[2])
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].getAttribute('aria-selected')).toBe('false')
    expect(tabs[1].getAttribute('aria-selected')).toBe('false')
    expect(tabs[3].getAttribute('aria-selected')).toBe('false')
  })
})

// ─── Carousel property tests ─────────────────────────────────────────────────

/**
 * **Validates: Requirements 9.2, 9.3**
 *
 * Property: After clicking dot i, only dot i has aria-selected="true";
 * all other dots have aria-selected="false".
 */
describe('Carousel – property: only active dot has aria-selected="true"', () => {
  it('only dot i has aria-selected="true" after navigating to index i', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 8 }).chain(count =>
          fc.tuple(
            fc.constant(count),
            fc.integer({ min: 0, max: count - 1 }),
          ),
        ),
        ([count, targetIndex]) => {
          const { unmount } = render(
            <Carousel items={makeItems(count)} renderItem={renderItem} />,
          )

          const tabs = screen.getAllByRole('tab')
          // Click the target dot to navigate to it
          fireEvent.click(tabs[targetIndex])

          const updatedTabs = screen.getAllByRole('tab')
          const allCorrect = updatedTabs.every((tab, i) => {
            const selected = tab.getAttribute('aria-selected')
            return i === targetIndex
              ? selected === 'true'
              : selected === 'false'
          })

          unmount()
          return allCorrect
        },
      ),
      { numRuns: 200 },
    )
  })
})
