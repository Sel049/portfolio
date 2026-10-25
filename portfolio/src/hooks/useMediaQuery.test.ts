import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMediaQuery } from './useMediaQuery'

// ─── helpers ────────────────────────────────────────────────────────────────

type ChangeListener = (event: MediaQueryListEvent) => void

/**
 * Creates a controllable mock of window.matchMedia that lets tests
 * imperatively fire change events.
 */
function createMatchMediaMock(initialMatches: boolean) {
  const listeners: ChangeListener[] = []
  let _matches = initialMatches

  const mql = {
    get matches() { return _matches },
    addEventListener: vi.fn((_type: string, listener: ChangeListener) => {
      listeners.push(listener)
    }),
    removeEventListener: vi.fn((_type: string, listener: ChangeListener) => {
      const idx = listeners.indexOf(listener)
      if (idx !== -1) listeners.splice(idx, 1)
    }),
  }

  /** Simulate a media-query match-state change. */
  function fireChange(newMatches: boolean) {
    _matches = newMatches
    listeners.forEach(fn => fn({ matches: newMatches } as MediaQueryListEvent))
  }

  return { mql, fireChange, listeners }
}

// ─── useMediaQuery tests ─────────────────────────────────────────────────────

describe('useMediaQuery', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockMatchMedia = vi.fn()
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
      configurable: true,
    })
  })

  // Req 16.1 — returns true when query matches initially
  it('returns true when the query matches on mount', () => {
    const { mql } = createMatchMediaMock(true)
    mockMatchMedia.mockReturnValue(mql)

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(true)
  })

  // Req 16.1 — returns false when query does not match initially
  it('returns false when the query does not match on mount', () => {
    const { mql } = createMatchMediaMock(false)
    mockMatchMedia.mockReturnValue(mql)

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(false)
  })

  // Req 16.2 — updates state when match state changes (false → true)
  it('updates to true when the media query starts matching', () => {
    const { mql, fireChange } = createMatchMediaMock(false)
    mockMatchMedia.mockReturnValue(mql)

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => fireChange(true))
    expect(result.current).toBe(true)
  })

  // Req 16.2 — updates state when match state changes (true → false)
  it('updates to false when the media query stops matching', () => {
    const { mql, fireChange } = createMatchMediaMock(true)
    mockMatchMedia.mockReturnValue(mql)

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(true)

    act(() => fireChange(false))
    expect(result.current).toBe(false)
  })

  // Req 16.3 — removes listener on unmount
  it('removes the change listener when the component unmounts', () => {
    const { mql } = createMatchMediaMock(false)
    mockMatchMedia.mockReturnValue(mql)

    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    unmount()

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  // Req 16.3 — removes listener and re-subscribes when query string changes
  it('removes the old listener and attaches a new one when the query changes', () => {
    const { mql: mql1 } = createMatchMediaMock(false)
    const { mql: mql2, fireChange: fireChange2 } = createMatchMediaMock(true)

    // The hook calls matchMedia twice on first render:
    //   1. Inside the lazy useState initializer
    //   2. Inside the useEffect (sync after mount)
    // On rerender with a new query it calls matchMedia twice again.
    mockMatchMedia
      .mockReturnValueOnce(mql1) // lazy useState init — query 1
      .mockReturnValueOnce(mql1) // useEffect sync — query 1
      .mockReturnValueOnce(mql2) // lazy useState init skipped on rerender; useEffect sync — query 2
      .mockReturnValue(mql2)

    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(max-width: 768px)' } }
    )

    expect(result.current).toBe(false)

    rerender({ query: '(prefers-color-scheme: dark)' })
    // Now listening to mql2 which matches
    expect(result.current).toBe(true)

    // Verify old listener was cleaned up
    expect(mql1.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    // New listener should fire updates
    act(() => fireChange2(false))
    expect(result.current).toBe(false)
  })

  // Multiple change events are all tracked
  it('tracks multiple consecutive changes', () => {
    const { mql, fireChange } = createMatchMediaMock(false)
    mockMatchMedia.mockReturnValue(mql)

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))

    act(() => fireChange(true))
    expect(result.current).toBe(true)

    act(() => fireChange(false))
    expect(result.current).toBe(false)

    act(() => fireChange(true))
    expect(result.current).toBe(true)
  })
})
