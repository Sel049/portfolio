import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Manages carousel index state and optional auto-play.
 *
 * Loop invariant: `0 <= activeIndex < itemCount` at all times.
 *
 * @param itemCount       - Total number of slides (must be >= 1)
 * @param autoPlayInterval - Auto-advance interval in ms; 0 or omitted = disabled
 *
 * Requirements: 9.8, 9.9, 9.10, 9.11, 9.12
 */
export function useCarousel(
  itemCount: number,
  autoPlayInterval = 0
): {
  activeIndex: number
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  pauseAutoPlay: () => void
  resumeAutoPlay: () => void
} {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Req 9.8: next() wraps from last → 0
  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % itemCount)
  }, [itemCount])

  // Req 9.9: prev() wraps from 0 → last
  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + itemCount) % itemCount)
  }, [itemCount])

  // Req 9.10: goTo(i) clamps i to [0, itemCount - 1]
  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, itemCount - 1)))
  }, [itemCount])

  // Req 9.11: auto-play with pause/resume support
  // Req 9.12: interval cleared on unmount (via effect cleanup)
  useEffect(() => {
    if (autoPlayInterval <= 0 || isPaused) return
    intervalRef.current = setInterval(next, autoPlayInterval)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoPlayInterval, isPaused, next])

  return {
    activeIndex,
    next,
    prev,
    goTo,
    pauseAutoPlay: () => setIsPaused(true),
    resumeAutoPlay: () => setIsPaused(false),
  }
}
