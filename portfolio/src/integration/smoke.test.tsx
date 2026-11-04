/**
 * End-to-end integration smoke tests.
 *
 * Covers:
 *  - Suite 1: Navbar scroll behavior (Req 3.1, 3.2, 3.3)
 *  - Suite 2: Mobile menu open / close (Req 3.4, 3.5, 3.6, 3.7)
 *  - Suite 3: Projects filter + carousel reset (Req 8.2, 8.3, 8.4)
 *  - Suite 4: Contact form full flow idle → submitting → success / error (Req 12.2, 12.3, 12.4, 12.5)
 *  - Suite 5: Reduced-motion — reveal elements visible immediately; carousel auto-play disabled (Req 14.4)
 */

import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Navbar from '../components/Navbar/Navbar'
import Projects from '../components/Projects/Projects'
import Contact from '../components/Contact/Contact'
import About from '../components/About/About'
import Carousel from '../components/ui/Carousel'

import { personal } from '../data/personal'
import { projects } from '../data/projects'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Reset scrollY to 0 and restore matchMedia to the no-match default. */
function resetScrollY(value = 0) {
  Object.defineProperty(window, 'scrollY', {
    value,
    writable: true,
    configurable: true,
  })
}

/**
 * Replace window.matchMedia with a stub that returns `matches = true`
 * for '(prefers-reduced-motion: reduce)' and `false` for everything else.
 */
function mockReducedMotion(active: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => {
      const matches = active && query === '(prefers-reduced-motion: reduce)'
      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
    }),
  })
}

/** Restore matchMedia to the global default (no matches). */
function restoreMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
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

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1: Navbar scroll behavior
// ─────────────────────────────────────────────────────────────────────────────

describe('Integration – Suite 1: Navbar scroll behavior', () => {
  beforeEach(() => resetScrollY(0))
  afterEach(() => {
    resetScrollY(0)
    cleanup()
  })

  /**
   * Req 3.1 — At scrollY = 0 the header must NOT have the glass class.
   */
  it('Navbar has no "glass" class when scrollY is 0', () => {
    resetScrollY(0)
    render(<Navbar />)
    const header = screen.getByRole('banner')
    expect(header.className).not.toContain('glass')
  })

  /**
   * Req 3.2 — After scrollY exceeds 60 the header MUST have the glass class.
   */
  it('Navbar gains "glass" class when scrollY exceeds 60', () => {
    resetScrollY(0)
    render(<Navbar />)

    resetScrollY(80)
    fireEvent.scroll(window)

    const header = screen.getByRole('banner')
    expect(header.className).toContain('glass')
  })

  /**
   * Req 3.3 — The transition class `duration-300` must always be present
   * on the header element so the glass ↔ transparent transition is smooth.
   */
  it('Navbar header always carries the "duration-300" transition class', () => {
    resetScrollY(0)
    render(<Navbar />)
    const header = screen.getByRole('banner')
    expect(header.className).toContain('duration-300')
  })

  /**
   * Req 3.2 — Glass class is removed again when scroll returns to 0.
   */
  it('Navbar loses "glass" class when scrollY returns to 0 after being > 60', () => {
    resetScrollY(0)
    render(<Navbar />)

    resetScrollY(100)
    fireEvent.scroll(window)
    expect(screen.getByRole('banner').className).toContain('glass')

    resetScrollY(0)
    fireEvent.scroll(window)
    expect(screen.getByRole('banner').className).not.toContain('glass')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2: Mobile menu open / close
// ─────────────────────────────────────────────────────────────────────────────

describe('Integration – Suite 2: Mobile menu', () => {
  afterEach(cleanup)

  /**
   * Req 3.6 / 3.7 — hamburger starts with aria-label="Open menu" and
   * aria-expanded="false".
   */
  it('hamburger button starts closed: aria-label="Open menu", aria-expanded="false"', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    expect(btn.getAttribute('aria-label')).toBe('Open menu')
  })

  /**
   * Req 3.4 / 3.6 / 3.7 — clicking hamburger opens the menu.
   */
  it('clicking hamburger opens menu: aria-label="Close menu", aria-expanded="true"', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(btn)

    const closeBtn = screen.getByRole('button', { name: 'Close menu' })
    expect(closeBtn.getAttribute('aria-expanded')).toBe('true')
    expect(closeBtn.getAttribute('aria-label')).toBe('Close menu')
  })

  /**
   * Req 3.5 — clicking hamburger again closes the menu.
   */
  it('clicking hamburger a second time closes menu again', () => {
    render(<Navbar />)

    // Open
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeTruthy()

    // Close
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')
    ).toBe('false')
  })

  /**
   * Req 3.4 — mobile menu container is aria-hidden="true" by default,
   * then aria-hidden="false" after open.
   */
  it('mobile menu container is aria-hidden initially, then visible after click', () => {
    render(<Navbar />)

    // Before open: the MobileMenu div has aria-hidden="true"
    expect(document.querySelector('[aria-hidden="true"]')).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    // After open: aria-hidden="false"
    expect(document.querySelector('[aria-hidden="false"]')).not.toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3: Projects filter + carousel
// ─────────────────────────────────────────────────────────────────────────────

describe('Integration – Suite 3: Projects filter + carousel', () => {
  afterEach(cleanup)

  /**
   * Req 8.3 — default state shows "All" button with aria-pressed="true"
   * and every project title is present in the DOM.
   */
  it('shows all projects and "All" filter active by default', () => {
    render(<Projects projects={projects} />)

    expect(
      screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')
    ).toBe('true')

    // All project titles must be in the DOM (some slides are aria-hidden)
    projects.forEach(p => {
      expect(screen.getByText(p.title, { selector: 'h3' })).toBeTruthy()
    })
  })

  /**
   * Req 8.4 — changing category resets carousel to index 0.
   * Strategy: advance to slide 2, then change category and check first dot
   * has aria-selected="true".
   */
  it('changing category filter resets carousel to slide 0', () => {
    render(<Projects projects={projects} />)

    // Advance past the first slide
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))

    // Confirm we are on slide 2
    const dotsBefore = screen.getAllByRole('tab')
    expect(dotsBefore[1].getAttribute('aria-selected')).toBe('true')

    // Switch to a non-All category — component re-keys the Carousel
    fireEvent.click(screen.getByRole('button', { name: 'Open Source' }))

    // First dot must now be selected again
    const dotsAfter = screen.getAllByRole('tab')
    expect(dotsAfter[0].getAttribute('aria-selected')).toBe('true')
  })

  /**
   * Req 8.2 — filtering by a specific category shows only matching projects.
   */
  it('filtering by "Backend" shows only Backend projects', () => {
    render(<Projects projects={projects} />)

    fireEvent.click(screen.getByRole('button', { name: 'Backend' }))

    const backendProjects = projects.filter(p => p.categories.includes('Backend'))
    const nonBackendProjects = projects.filter(p => !p.categories.includes('Backend'))

    backendProjects.forEach(p => {
      expect(screen.getByText(p.title, { selector: 'h3' })).toBeTruthy()
    })
    nonBackendProjects.forEach(p => {
      expect(screen.queryByText(p.title, { selector: 'h3' })).toBeNull()
    })
  })

  /**
   * Req 8.2 — after filtering, the active filter button has aria-pressed="true"
   * and the previous one has aria-pressed="false".
   */
  it('aria-pressed state reflects the active category filter', () => {
    render(<Projects projects={projects} />)

    const webAppBtn = screen.getByRole('button', { name: 'Web App' })
    fireEvent.click(webAppBtn)

    expect(webAppBtn.getAttribute('aria-pressed')).toBe('true')
    expect(
      screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')
    ).toBe('false')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Suite 4: Contact form full flow
// ─────────────────────────────────────────────────────────────────────────────

describe('Integration – Suite 4: Contact form full flow', () => {
  const fillValidForm = async (
    user: ReturnType<typeof userEvent.setup>,
    form: HTMLFormElement
  ) => {
    const inForm = within(form)
    await user.type(inForm.getByLabelText(/name/i), 'Jane Doe')
    await user.type(inForm.getByLabelText(/email/i), 'jane@example.com')
    await user.type(inForm.getByLabelText(/subject/i), 'Integration test subject')
    await user.type(
      inForm.getByLabelText(/message/i),
      'This is a test message that is definitely long enough.'
    )
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    cleanup()
  })

  /**
   * Req 12.2 — submitting a valid form transitions to submitting state:
   * submit button is disabled and shows "Sending…".
   */
  it('idle → submitting: button is disabled and shows "Sending…" on valid submit', async () => {
    // Fetch never resolves so we can observe submitting state
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))

    const user = userEvent.setup()
    const { container } = render(<Contact data={personal} />)
    const form = container.querySelector('form') as HTMLFormElement

    await fillValidForm(user, form)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    const btn = screen.getByRole('button', { name: /sending/i }) as HTMLButtonElement
    expect(btn).toBeTruthy()
    expect(btn.disabled).toBe(true)
  })

  /**
   * Req 12.3 — after a successful fetch response, the component shows the
   * success confirmation ("Message sent!").
   */
  it('submitting → success: shows success confirmation on 200 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const user = userEvent.setup()
    const { container } = render(<Contact data={personal} />)
    const form = container.querySelector('form') as HTMLFormElement

    await fillValidForm(user, form)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText(/message sent/i)).toBeTruthy()
  })

  /**
   * Req 12.3 / 12.5 — success state offers "Send another message" button
   * that returns to idle.
   */
  it('success state: "Send another message" returns to idle', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const user = userEvent.setup()
    const { container } = render(<Contact data={personal} />)
    const form = container.querySelector('form') as HTMLFormElement

    await fillValidForm(user, form)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByText(/message sent/i)

    await user.click(screen.getByRole('button', { name: /send another/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy()
    })
  })

  /**
   * Req 12.4 — a non-ok fetch response shows the error banner (role="alert").
   */
  it('submitting → error: shows error banner on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const user = userEvent.setup()
    const { container } = render(<Contact data={personal} />)
    const form = container.querySelector('form') as HTMLFormElement

    await fillValidForm(user, form)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    const banner = await screen.findByRole('alert')
    expect(banner).toBeTruthy()
  })

  /**
   * Req 12.4 — a network error (fetch throws) also shows the error banner.
   */
  it('submitting → error: shows error banner on network error (fetch throws)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const user = userEvent.setup()
    const { container } = render(<Contact data={personal} />)
    const form = container.querySelector('form') as HTMLFormElement

    await fillValidForm(user, form)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    const banner = await screen.findByRole('alert')
    expect(banner).toBeTruthy()
  })

  /**
   * Req 12.5 — dismissing the error banner returns to idle: error banner
   * disappears and the form submit button is visible again.
   */
  it('error state: dismissing error banner returns to idle', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const user = userEvent.setup()
    const { container } = render(<Contact data={personal} />)
    const form = container.querySelector('form') as HTMLFormElement

    await fillValidForm(user, form)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByRole('alert')

    await user.click(screen.getByRole('button', { name: /dismiss error/i }))

    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull()
      expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy()
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Suite 5: Reduced-motion
// ─────────────────────────────────────────────────────────────────────────────

describe('Integration – Suite 5: Reduced-motion', () => {
  afterEach(() => {
    restoreMatchMedia()
    cleanup()
    vi.useRealTimers()
  })

  /**
   * Req 14.4 — when prefers-reduced-motion: reduce is active, useScrollReveal
   * must immediately add the `visible` class to ALL `.reveal` elements without
   * waiting for any IntersectionObserver callback.
   */
  it('all .reveal elements get "visible" class immediately when prefers-reduced-motion is active', () => {
    // Activate reduced-motion BEFORE rendering
    mockReducedMotion(true)

    render(<About data={personal} />)

    // After render + effect flush (useEffect runs synchronously in RTL), all
    // .reveal elements in the container must carry the `visible` class.
    const revealEls = document.querySelectorAll<HTMLElement>('.reveal')
    expect(revealEls.length).toBeGreaterThan(0)

    revealEls.forEach(el => {
      expect(el.classList.contains('visible')).toBe(true)
    })
  })

  /**
   * Req 14.4 — confirm that without reduced-motion the `visible` class is NOT
   * added automatically (IntersectionObserver would handle it).
   */
  it('.reveal elements do NOT have "visible" class automatically without reduced-motion', () => {
    // Standard matchMedia returning false for every query (set by restoreMatchMedia)
    restoreMatchMedia()

    render(<About data={personal} />)

    const revealEls = document.querySelectorAll<HTMLElement>('.reveal')
    expect(revealEls.length).toBeGreaterThan(0)

    // None should be visible immediately — IntersectionObserver handles it
    revealEls.forEach(el => {
      expect(el.classList.contains('visible')).toBe(false)
    })
  })

  /**
   * Req 9.6 / 9.12 — Carousel with autoPlayInterval > 0 should NOT
   * auto-advance when prefers-reduced-motion is active.
   */
  it('Carousel auto-play is disabled when prefers-reduced-motion is active', () => {
    mockReducedMotion(true)
    vi.useFakeTimers()

    const items = ['A', 'B', 'C']
    const { container } = render(
      <Carousel
        items={items}
        renderItem={(item) => <div>{item}</div>}
        autoPlayInterval={500}
      />
    )

    // The first dot should be active (index 0)
    const dotsInitial = container.querySelectorAll('[role="tab"]')
    expect(dotsInitial[0].getAttribute('aria-selected')).toBe('true')

    expect(vi.getTimerCount()).toBe(0)
    act(() => vi.advanceTimersByTime(3000))

    const dotsAfter = container.querySelectorAll('[role="tab"]')
    expect(dotsAfter[0].getAttribute('aria-selected')).toBe('true')

    vi.useRealTimers()
  })

  /**
   * Additional reduced-motion smoke: Projects section's .reveal elements
   * all become visible immediately under reduced-motion.
   */
  it('Projects section .reveal elements are immediately visible under reduced-motion', () => {
    mockReducedMotion(true)

    render(<Projects projects={projects} />)

    const revealEls = document.querySelectorAll<HTMLElement>('.reveal')
    expect(revealEls.length).toBeGreaterThan(0)

    revealEls.forEach(el => {
      expect(el.classList.contains('visible')).toBe(true)
    })
  })
})
