import { useRef, useEffect } from 'react'
import { useMediaQuery } from './useMediaQuery'

/**
 * Attaches an IntersectionObserver to all child `.reveal` elements within a
 * container ref. When a `.reveal` element enters the viewport, the `visible`
 * class is added and the element is unobserved (fire-once behaviour).
 *
 * If `prefers-reduced-motion: reduce` is active, all `.reveal` targets are
 * made visible immediately without setting up the observer.
 *
 * @param options - Optional IntersectionObserver options merged over the defaults
 *                  `{ threshold: 0.15, rootMargin: '0px 0px -48px 0px' }`.
 * @returns A ref to attach to the container element whose children should be revealed.
 *
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6
 */
export function useScrollReveal<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
): React.RefObject<T> {
  const ref = useRef<T>(null)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const container = ref.current
    if (!container) return

    // Req 14.1: Observe all child elements with class `reveal`
    const targets = Array.from(container.querySelectorAll<HTMLElement>('.reveal'))

    if (prefersReducedMotion) {
      // Req 14.4: Immediately add `visible` when reduced-motion is preferred
      targets.forEach(el => el.classList.add('visible'))
      return
    }

    // Req 14.6: Default options; caller-supplied options are merged in after
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Req 14.2: Add `visible` class on intersection
            entry.target.classList.add('visible')
            // Req 14.3: Unobserve so the animation fires only once
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -48px 0px', ...options }
    )

    targets.forEach(el => observer.observe(el))

    // Req 14.5: Disconnect observer on unmount
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return ref
}
