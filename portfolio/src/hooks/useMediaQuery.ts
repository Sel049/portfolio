import { useState, useEffect } from 'react'

/**
 * Subscribes to a CSS media query and returns its current match state.
 *
 * @param query - A valid CSS media query string (e.g. '(prefers-reduced-motion: reduce)')
 * @returns `true` when the media query matches the current environment, `false` otherwise.
 *
 * Requirements: 16.1, 16.2, 16.3
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Initialize with the current match state (Req 16.1)
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueryList = window.matchMedia(query)

    // Sync state in case the query changed between render and effect (Req 16.1)
    setMatches(mediaQueryList.matches)

    // Update state whenever the match state changes (Req 16.2)
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener('change', handleChange)

    // Clean up the listener on unmount or when the query string changes (Req 16.3)
    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
