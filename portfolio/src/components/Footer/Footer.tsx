import React from 'react'
import type { PersonalData, Service } from '../../types'

export interface FooterProps {
  data: PersonalData
  services: Service[]
}

// ─── Navigation links (mirror Navbar's NAV_LINKS) ────────────────────────────

const NAV_LINKS = [
  { label: 'Hero',         href: '#hero'         },
  { label: 'About',        href: '#about'        },
  { label: 'Tech Stack',   href: '#techstack'    },
  { label: 'Skills',       href: '#skills'       },
  { label: 'Projects',     href: '#projects'     },
  { label: 'Services',     href: '#services'     },
  { label: 'Contact',      href: '#contact'      },
]

// ─── Inline social icons ──────────────────────────────────────────────────────

const SocialIcon: React.FC<{ name: string }> = ({ name }) => {
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'github':
      return (
        <svg {...props}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...props}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    case 'twitter':
      return (
        <svg {...props}>
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...props}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
  }
}

// ─── Column heading ───────────────────────────────────────────────────────────

const ColHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="font-heading text-body font-semibold text-text-primary mb-4 uppercase tracking-wider text-label">
    {children}
  </h3>
)

// ─── Footer ───────────────────────────────────────────────────────────────────

/**
 * Footer component.
 *
 * Requirements:
 * - 13.1: Renders social link entries from PersonalData.socials (platform + URL)
 * - 13.2: Renders service-name links from the services data array
 * - 13.3: All target="_blank" links include rel="noopener noreferrer"
 */
export default function Footer({ data, services }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-secondary border-t border-border-subtle" aria-label="Site footer">

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Column 1: Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
            <a
              href="#hero"
              className="focus-ring inline-block font-heading font-bold text-body-lg text-text-primary hover:text-green-primary transition-colors duration-200"
            >
              {data.name}
            </a>
            <p className="text-body-sm font-body text-text-secondary leading-relaxed max-w-xs">
              {data.tagline}
            </p>
            <p className="text-body-sm font-body text-text-muted">
              {data.location}
            </p>
          </div>

          {/* ── Column 2: Navigation ── */}
          <div>
            <ColHeading>Navigation</ColHeading>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="focus-ring text-body-sm font-body text-text-secondary hover:text-green-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Column 3: Services (Req 13.2) ── */}
          <div>
            <ColHeading>Services</ColHeading>
            <ul className="flex flex-col gap-2">
              {services.map(service => (
                <li key={service.title}>
                  {/* Req 13.2: service-name link anchored to services section */}
                  <a
                    href="#services"
                    className="focus-ring text-body-sm font-body text-text-secondary hover:text-green-primary transition-colors duration-200"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Social links (Req 13.1, 13.3) ── */}
          <div>
            <ColHeading>Connect</ColHeading>
            <ul className="flex flex-col gap-3">
              {data.socials.map(social => {
                const isExternal = social.platform !== 'email'
                return (
                  <li key={social.platform}>
                    {/* Req 13.1: renders platform name and URL */}
                    {/* Req 13.3: target="_blank" links include rel="noopener noreferrer" */}
                    <a
                      href={social.url}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      aria-label={social.platform}
                      className="focus-ring inline-flex items-center gap-2.5 text-body-sm font-body text-text-secondary hover:text-green-primary transition-colors duration-200"
                    >
                      <SocialIcon name={social.icon} />
                      <span className="capitalize">{social.platform}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-label font-body text-text-muted">
            © {currentYear} {data.name}. All rights reserved.
          </p>
          <p className="text-label font-body text-text-muted">
            Built with React &amp; TypeScript
          </p>
        </div>
      </div>

    </footer>
  )
}
