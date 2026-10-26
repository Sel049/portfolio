import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Navbar from './Navbar'

// ─── Navbar unit tests ────────────────────────────────────────────────────────

/**
 * Helper: get the <header> element rendered by Navbar.
 */
function getHeader() {
  return screen.getByRole('banner')
}

beforeEach(() => {
  // Reset scroll position to top before every test (Req 3.1)
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
})

afterEach(() => {
  // Restore default scrollY
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
})

// ─── Scroll-based styling ─────────────────────────────────────────────────────

describe('Navbar – scroll styling', () => {
  // Req 3.1 — Transparent (no glass class) at scroll = 0
  it('is transparent (no "glass" class) at scroll position 0', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    render(<Navbar />)
    const header = getHeader()
    expect(header.className).not.toContain('glass')
  })

  // Req 3.2 — Applies glass class when scrollY > 60
  it('applies "glass" class when scrollY is greater than 60', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    render(<Navbar />)

    // Simulate scrolling past the threshold
    Object.defineProperty(window, 'scrollY', { value: 80, writable: true, configurable: true })
    fireEvent.scroll(window)

    const header = getHeader()
    expect(header.className).toContain('glass')
  })
})

// ─── Hamburger button ARIA attributes ─────────────────────────────────────────

describe('Navbar – hamburger ARIA attributes', () => {
  // Req 3.6 — aria-label="Open menu" when closed
  it('has aria-label="Open menu" when menu is closed', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    expect(btn).toBeTruthy()
  })

  // Req 3.7 — aria-expanded="false" when closed
  it('has aria-expanded="false" when menu is closed', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })

  // Req 3.6 — aria-label="Close menu" after click
  it('has aria-label="Close menu" after hamburger click', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(btn)
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeTruthy()
  })

  // Req 3.7 — aria-expanded="true" after click
  it('has aria-expanded="true" after hamburger click', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(btn)
    const openBtn = screen.getByRole('button', { name: 'Close menu' })
    expect(openBtn.getAttribute('aria-expanded')).toBe('true')
  })
})

// ─── Mobile menu visibility ───────────────────────────────────────────────────

describe('Navbar – mobile menu', () => {
  // Req 3.4 — Mobile menu is hidden initially (aria-hidden)
  it('mobile menu is hidden (aria-hidden="true") initially', () => {
    render(<Navbar />)
    // MobileMenu renders a div with aria-hidden={!isOpen}
    const mobileMenuWrapper = document.querySelector('[aria-hidden="true"]')
    expect(mobileMenuWrapper).not.toBeNull()
  })

  // Req 3.4 — Mobile menu becomes visible (aria-hidden="false") after click
  it('mobile menu becomes visible (aria-hidden="false") after hamburger click', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(btn)

    const mobileMenuWrapper = document.querySelector('[aria-hidden="false"]')
    expect(mobileMenuWrapper).not.toBeNull()
  })

  // Mobile menu closes after second hamburger click
  it('mobile menu is hidden again after second hamburger click', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })

    // Open
    fireEvent.click(btn)
    expect(document.querySelector('[aria-hidden="false"]')).not.toBeNull()

    // Close
    const closeBtn = screen.getByRole('button', { name: 'Close menu' })
    fireEvent.click(closeBtn)
    expect(document.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
