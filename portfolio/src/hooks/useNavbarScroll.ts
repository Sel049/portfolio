import { useState, useEffect } from 'react'

/**
 * Tracks whether the page has scrolled past a pixel threshold.
 * Used by Navbar to toggle between transparent and glassmorphism styles.
 *
 * @param threshold - Scroll position in pixels above which `isScrolled` becomes `true`. Defaults to 60.
 * @returns `true` when `window.scrollY` is strictly greater than `threshold`, `false` otherwise.
 *
 * Requirements: 15.1, 15.2, 15.3, 15.4
 */
export function useNavbarScroll(threshold = 60): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(() => {
    // Initialize with the current scroll position (Req 15.1)
    if (typeof window === 'undefined') return false
    return window.scrollY > threshold
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Sync state in case scroll position changed between render and effect (Req 15.1)
    setIsScrolled(window.scrollY > threshold)

    // Attach passive scroll listener to avoid blocking scrolling (Req 15.3)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Remove listener on unmount (Req 15.4)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return isScrolled
}
