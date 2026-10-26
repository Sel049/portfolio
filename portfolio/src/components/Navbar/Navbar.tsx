import React, { useState } from 'react'
import { useNavbarScroll } from '../../hooks/useNavbarScroll'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { label: 'Hero',         href: '#hero'          },
  { label: 'About',        href: '#about'         },
  { label: 'Tech Stack',   href: '#techstack'     },
  { label: 'Skills',       href: '#skills'        },
  { label: 'Projects',     href: '#projects'      },
  { label: 'Services',     href: '#services'      },
  { label: 'Testimonials', href: '#testimonials'  },
  { label: 'Contact',      href: '#contact'       },
]

/**
 * Navbar component.
 *
 * - Transparent when scrollY === 0 (Req 3.1)
 * - Glassmorphism (glass + shadow-glass) when scrollY > 60 (Req 3.2)
 * - 300ms CSS transition on scroll state change (Req 3.3)
 * - Mobile hamburger with aria-label and aria-expanded (Req 3.6, 3.7)
 * - Mobile menu slides down on open (Req 3.4, 3.5)
 * - Nav links scroll to section IDs (Req 3.8)
 * - "Hire Me" button scrolls to #contact (Req 3.9)
 */
const Navbar: React.FC = () => {
  const isScrolled = useNavbarScroll()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        isScrolled
          ? 'glass shadow-glass rounded-none'
          : 'bg-transparent',
      ].join(' ')}
      role="banner"
    >
      {/* Main nav bar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / brand */}
          <a
            href="#hero"
            className="focus-ring font-heading font-bold text-body-lg text-text-primary hover:text-green-primary transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('#hero')
            }}
          >
            Portfolio
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="focus-ring text-body font-body text-text-secondary hover:text-text-primary transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(link.href)
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop "Hire Me" button */}
          <a
            href="#contact"
            className="focus-ring hidden md:inline-block py-2 px-5 rounded-lg bg-green-primary text-bg-primary font-heading font-semibold text-body hover:bg-green-secondary transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('#contact')
            }}
          >
            Hire Me
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="focus-ring md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMobileMenu}
          >
            {/* Hamburger icon — three bars that animate to X when open */}
            <span
              className={[
                'block w-6 h-0.5 bg-text-primary transition-transform duration-300',
                isMobileMenuOpen ? 'translate-y-2 rotate-45' : '',
              ].join(' ')}
            />
            <span
              className={[
                'block w-6 h-0.5 bg-text-primary transition-opacity duration-300',
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
            />
            <span
              className={[
                'block w-6 h-0.5 bg-text-primary transition-transform duration-300',
                isMobileMenuOpen ? '-translate-y-2 -rotate-45' : '',
              ].join(' ')}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          links={NAV_LINKS}
          onLinkClick={handleLinkClick}
        />
      </div>
    </header>
  )
}

export default Navbar
