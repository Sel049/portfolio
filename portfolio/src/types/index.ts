// ─── Personal / Contact ──────────────────────────────────────────────────────

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | string
  url: string
  /** Icon component or name key */
  icon: string
}

export interface Stat {
  value: string      // e.g. "3+"
  label: string      // e.g. "Years Experience"
}

export interface PersonalData {
  name: string
  title: string
  tagline: string
  bio: string[]            // paragraphs
  resumeUrl: string        // path or external URL
  portraitSrc: string
  email: string
  location: string
  socials: SocialLink[]
  stats: Stat[]
}

// ─── Tech Stack ───────────────────────────────────────────────────────────────

export interface TechItem {
  name: string
  /** SVG icon key or src path */
  icon: string
  /** Color used for icon accent (optional) */
  color?: string
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export type ProficiencyLabel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export interface SkillEntry {
  icon: string
  name: string
  proficiency: ProficiencyLabel
  /** 0–100 */
  level: number
}

export interface SkillCategory {
  title: string
  skills: SkillEntry[]
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  title: string
  description: string
  /** URL path or external link */
  imageSrc: string
  tags: string[]
  /** Comma-separated category labels for filter */
  categories: string[]
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface Service {
  icon: string
  title: string
  description: string
}

// ─── Approach / Testimonials ──────────────────────────────────────────────────

export interface ApproachEntry {
  icon: string
  heading: string
  body: string
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'
