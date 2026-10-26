/**
 * Vitest global test setup.
 *
 * jsdom does not implement window.matchMedia or IntersectionObserver.
 * These stubs provide minimal no-op implementations so component tests
 * that transitively use useMediaQuery / useScrollReveal can render.
 */
import { vi } from 'vitest'

// ── window.matchMedia stub ────────────────────────────────────────────────────
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// ── IntersectionObserver stub ─────────────────────────────────────────────────
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof IntersectionObserver
}
