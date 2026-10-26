import React from 'react'

interface NavLink {
  label: string
  href: string
}

interface MobileMenuProps {
  isOpen: boolean
  links: NavLink[]
  onLinkClick: (href: string) => void
}

/**
 * Mobile slide-down menu for the Navbar.
 * Slides in/out with a CSS transition on transform.
 */
const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, links, onLinkClick }) => {
  return (
    <div
      className={[
        'md:hidden',
        'overflow-hidden',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-y-0' : '-translate-y-full',
        isOpen ? 'max-h-screen' : 'max-h-0',
      ].join(' ')}
      aria-hidden={!isOpen}
    >
      <nav className="px-6 pb-6 pt-2 flex flex-col gap-1">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="focus-ring block py-3 px-2 text-body font-body text-text-secondary hover:text-text-primary transition-colors duration-200 border-b border-border-subtle last:border-none"
            onClick={(e) => {
              e.preventDefault()
              onLinkClick(link.href)
            }}
            tabIndex={isOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          className="focus-ring mt-4 inline-block text-center py-3 px-6 rounded-lg bg-green-primary text-bg-primary font-heading font-semibold text-body hover:bg-green-secondary transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault()
            onLinkClick('#contact')
          }}
          tabIndex={isOpen ? 0 : -1}
        >
          Hire Me
        </a>
      </nav>
    </div>
  )
}

export default MobileMenu
