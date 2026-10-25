import { renderHook, act } from '@testing-library/react'
import * as fc from 'fast-check'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCarousel } from './useCarousel'

// ─── useCarousel unit tests ───────────────────────────────────────────────────

describe('useCarousel – next()', () => {
  // Req 9.9 — next() advances activeIndex by 1
  it('increments activeIndex by 1 on each call', () => {
    const { result } = renderHook(() => useCarousel(5))
    expect(result.current.activeIndex).toBe(0)

    act(() => result.current.next())
    expect(result.current.activeIndex).toBe(1)

    act(() => result.current.next())
    expect(result.current.activeIndex).toBe(2)
  })

  // Req 9.9 — next() wraps from last → 0
  it('wraps from the last index back to 0', () => {
    const { result } = renderHook(() => useCarousel(3))

    act(() => result.current.goTo(2))
    expect(result.current.activeIndex).toBe(2)

    act(() => result.current.next())
    expect(result.current.activeIndex).toBe(0)
  })
})

describe('useCarousel – prev()', () => {
  // Req 9.10 — prev() decrements activeIndex by 1
  it('decrements activeIndex by 1', () => {
    const { result } = renderHook(() => useCarousel(5))

    act(() => result.current.goTo(3))
    expect(result.current.activeIndex).toBe(3)

    act(() => result.current.prev())
    expect(result.current.activeIndex).toBe(2)
  })

  // Req 9.10 — prev() wraps from 0 → last
  it('wraps from index 0 to the last index', () => {
    const { result } = renderHook(() => useCarousel(4))
    expect(result.current.activeIndex).toBe(0)

    act(() => result.current.prev())
    expect(result.current.activeIndex).toBe(3)
  })
})

describe('useCarousel – goTo()', () => {
  // Req 9.11 — goTo(i) sets activeIndex to i when i is in range
  it('sets activeIndex to the given index when in range', () => {
    const { result } = renderHook(() => useCarousel(5))

    act(() => result.current.goTo(3))
    expect(result.current.activeIndex).toBe(3)
  })

  // Req 9.11 — goTo(i) clamps negative values to 0
  it('clamps negative values to 0', () => {
    const { result } = renderHook(() => useCarousel(5))

    act(() => result.current.goTo(-10))
    expect(result.current.activeIndex).toBe(0)
  })

  // Req 9.11 — goTo(i) clamps values >= itemCount to itemCount - 1
  it('clamps values above itemCount - 1 to itemCount - 1', () => {
    const { result } = renderHook(() => useCarousel(5))

    act(() => result.current.goTo(100))
    expect(result.current.activeIndex).toBe(4)
  })

  it('clamps index exactly equal to itemCount to itemCount - 1', () => {
    const { result } = renderHook(() => useCarousel(5))

    act(() => result.current.goTo(5))
    expect(result.current.activeIndex).toBe(4)
  })
})

describe('useCarousel – auto-play', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('advances the index automatically when autoPlayInterval > 0', () => {
    const { result } = renderHook(() => useCarousel(3, 500))
    expect(result.current.activeIndex).toBe(0)

    act(() => { vi.advanceTimersByTime(500) })
    expect(result.current.activeIndex).toBe(1)

    act(() => { vi.advanceTimersByTime(500) })
    expect(result.current.activeIndex).toBe(2)
  })

  it('wraps around during auto-play', () => {
    const { result } = renderHook(() => useCarousel(2, 200))

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.activeIndex).toBe(1)

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.activeIndex).toBe(0)
  })

  it('stops auto-play when pauseAutoPlay is called', () => {
    const { result } = renderHook(() => useCarousel(3, 300))

    act(() => { result.current.pauseAutoPlay() })
    act(() => { vi.advanceTimersByTime(900) })
    expect(result.current.activeIndex).toBe(0)
  })

  it('resumes auto-play after resumeAutoPlay is called', () => {
    const { result } = renderHook(() => useCarousel(3, 300))

    act(() => { result.current.pauseAutoPlay() })
    act(() => { vi.advanceTimersByTime(600) })
    expect(result.current.activeIndex).toBe(0)

    act(() => { result.current.resumeAutoPlay() })
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current.activeIndex).toBe(1)
  })

  // Req 9.12 — interval is cleared on unmount
  it('clears the interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = renderHook(() => useCarousel(3, 300))

    unmount()
    expect(clearSpy).toHaveBeenCalled()

    clearSpy.mockRestore()
  })
})

// ─── useCarousel property tests ───────────────────────────────────────────────

/**
 * **Validates: Requirements 9.8, 9.9, 9.10, 9.11**
 *
 * Property: For any sequence of next() / prev() / goTo() calls, activeIndex
 * remains in [0, itemCount - 1] at all times.
 */
describe('useCarousel – property: 0 <= activeIndex < itemCount', () => {
  type Operation =
    | { type: 'next' }
    | { type: 'prev' }
    | { type: 'goTo'; index: number }

  const operationArb = (itemCount: number): fc.Arbitrary<Operation> =>
    fc.oneof(
      fc.constant({ type: 'next' as const }),
      fc.constant({ type: 'prev' as const }),
      fc.record({
        type: fc.constant('goTo' as const),
        // Mix of in-range, negative, and out-of-range values
        index: fc.oneof(
          fc.integer({ min: 0, max: itemCount - 1 }),
          fc.integer({ min: -100, max: -1 }),
          fc.integer({ min: itemCount, max: itemCount + 100 }),
        ),
      }),
    )

  it('activeIndex is always in [0, itemCount - 1] for any operation sequence', () => {
    fc.assert(
      fc.property(
        // itemCount between 1 and 20, paired with a sequence of operations for that count
        fc.integer({ min: 1, max: 20 }).chain(count =>
          fc.tuple(
            fc.constant(count),
            fc.array(operationArb(count), { minLength: 1, maxLength: 50 }),
          )
        ),
        ([count, ops]) => {
          const { result } = renderHook(() => useCarousel(count))

          for (const op of ops) {
            act(() => {
              if (op.type === 'next') result.current.next()
              else if (op.type === 'prev') result.current.prev()
              else result.current.goTo(op.index)
            })

            const idx = result.current.activeIndex
            if (idx < 0 || idx >= count) return false
          }

          return true
        },
      ),
      { numRuns: 200 },
    )
  })

  it('activeIndex stays in range for single-item carousel (itemCount = 1)', () => {
    const { result } = renderHook(() => useCarousel(1))
    expect(result.current.activeIndex).toBe(0)

    act(() => result.current.next())
    expect(result.current.activeIndex).toBe(0)

    act(() => result.current.prev())
    expect(result.current.activeIndex).toBe(0)

    act(() => result.current.goTo(5))
    expect(result.current.activeIndex).toBe(0)

    act(() => result.current.goTo(-5))
    expect(result.current.activeIndex).toBe(0)
  })
})
