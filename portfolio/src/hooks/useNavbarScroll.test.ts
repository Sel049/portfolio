import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNavbarScroll } from './useNavbarScroll'

// ─── helpers ────────────────────────────────────────────────────────────────

/** Simulate the browser's scrollY value and fire a 'scroll' event. */
function simulateScroll(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

// ─── useNavbarScroll tests ───────────────────────────────────────────────────

describe('useNavbarScroll', () => {
  beforeEach(() => {
    // Reset scrollY to 0 before each test
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
  })

  // Req 15.1 — returns false when scrollY <= threshold
  it('returns false when scrollY is below the threshold', () => {
    const { result } = renderHook(() => useNavbarScroll(60))
    expect(result.current).toBe(false)
  })

  // Req 15.1 — returns false when scrollY equals threshold (strict greater-than)
  it('returns false when scrollY equals the threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 60, writable: true, configurable: true })
    const { result } = renderHook(() => useNavbarScroll(60))
    expect(result.current).toBe(false)
  })

  // Req 15.1 — returns true when scrollY > threshold
  it('returns true when scrollY is above the threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 61, writable: true, configurable: true })
    const { result } = renderHook(() => useNavbarScroll(60))
    expect(result.current).toBe(true)
  })

  // Req 15.2 — default threshold is 60px
  it('uses 60px as the default threshold', () => {
    // At 60 still false (strict >)
    Object.defineProperty(window, 'scrollY', { value: 60, writable: true, configurable: true })
    const { result: at60 } = renderHook(() => useNavbarScroll())
    expect(at60.current).toBe(false)

    Object.defineProperty(window, 'scrollY', { value: 61, writable: true, configurable: true })
    const { result: at61 } = renderHook(() => useNavbarScroll())
    expect(at61.current).toBe(true)
  })

  // Req 15.1 — updates state when scroll event fires
  it('updates to true when the user scrolls past the threshold', () => {
    const { result } = renderHook(() => useNavbarScroll(60))
    expect(result.current).toBe(false)

    act(() => simulateScroll(100))
    expect(result.current).toBe(true)
  })

  it('updates back to false when the user scrolls back above the threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
    const { result } = renderHook(() => useNavbarScroll(60))
    expect(result.current).toBe(true)

    act(() => simulateScroll(30))
    expect(result.current).toBe(false)
  })

  // Req 15.3 — scroll listener is registered with { passive: true }
  it('attaches the scroll listener with { passive: true }', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    renderHook(() => useNavbarScroll(60))

    const scrollCalls = addSpy.mock.calls.filter(([event]) => event === 'scroll')
    expect(scrollCalls.length).toBeGreaterThan(0)
    expect(scrollCalls[0][2]).toMatchObject({ passive: true })

    addSpy.mockRestore()
  })

  // Req 15.4 — removes scroll listener on unmount
  it('removes the scroll listener when the component unmounts', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useNavbarScroll(60))

    unmount()

    const scrollRemovals = removeSpy.mock.calls.filter(([event]) => event === 'scroll')
    expect(scrollRemovals.length).toBeGreaterThan(0)

    removeSpy.mockRestore()
  })

  // Re-attaches listener when threshold changes
  it('re-attaches listener and updates state when threshold prop changes', () => {
    const { result, rerender } = renderHook(
      ({ threshold }) => useNavbarScroll(threshold),
      { initialProps: { threshold: 60 } }
    )

    act(() => simulateScroll(80))
    expect(result.current).toBe(true)

    // Lower threshold — 80 is still above 40
    rerender({ threshold: 40 })
    expect(result.current).toBe(true)

    // Raise threshold above current scrollY
    rerender({ threshold: 200 })
    expect(result.current).toBe(false)
  })
})
