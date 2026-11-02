import React, { useState, useId } from 'react'
import type { PersonalData, ContactFormData, ContactFormErrors, FormStatus } from '../../types'
import SectionWrapper from '../ui/SectionWrapper'
import GlassCard from '../ui/GlassCard'
import { validateForm } from '../../utils/validateForm'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface ContactProps {
  data: PersonalData
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ─── Field component ──────────────────────────────────────────────────────────

interface FieldProps {
  id: string
  label: string
  error?: string
  children: React.ReactElement
}

const Field: React.FC<FieldProps> = ({ id, label, error, children }) => {
  const errorId = `${id}-error`
  const child = React.cloneElement(children, {
    id,
    'aria-describedby': error ? errorId : undefined,
    'aria-invalid': error ? true : undefined,
  })

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-sm font-body font-medium text-text-secondary">
        {label}
      </label>
      {child}
      {error && (
        <p id={errorId} role="alert" className="text-label text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Input / Textarea base classes ───────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  [
    'focus-ring w-full rounded-lg px-4 py-3 text-body font-body',
    'bg-bg-elevated border text-text-primary placeholder-text-muted',
    'transition-colors duration-200',
    hasError
      ? 'border-red-500 focus:border-red-400'
      : 'border-border-subtle focus:border-border-green',
  ].join(' ')

// ─── Initial form state ───────────────────────────────────────────────────────

const EMPTY_FORM: ContactFormData = { name: '', email: '', subject: '', message: '' }

// ─── Contact component ────────────────────────────────────────────────────────

/**
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.8, 12.9, 12.10, 12.11
 *
 * State machine:  idle → submitting → success | error
 *                 (error dismiss / "send another") → idle
 */
const Contact: React.FC<ContactProps> = ({ data }) => {
  const sectionRef = useScrollReveal<HTMLDivElement>()
  const baseId = useId()

  // ── Form state ──
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')

  // ── Field ids (stable) ──
  const ids = {
    name: `${baseId}-name`,
    email: `${baseId}-email`,
    subject: `${baseId}-subject`,
    message: `${baseId}-message`,
  }

  // ── Handlers ──

  const handleChange = (field: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
      // Req 12.8: clear that field's error on change when errors exist
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Run validation (Req 12.2)
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Transition to submitting (Req 12.2)
    setStatus('submitting')
    setErrors({})

    // Req 12.11: read endpoint from env
    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined

    try {
      const response = await fetch(endpoint ?? '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      // Req 12.3: success
      setStatus('success')
    } catch {
      // Req 12.4: error
      setStatus('error')
    }
  }

  const handleDismissError = () => {
    // Req 12.5
    setStatus('idle')
  }

  const handleSendAnother = () => {
    // Req 12.5
    setFormData(EMPTY_FORM)
    setErrors({})
    setStatus('idle')
  }

  // ── Success view (Req 12.3, 12.5) ──
  if (status === 'success') {
    return (
      <SectionWrapper id="contact">
        <div ref={sectionRef} className="flex justify-center">
          <GlassCard elevated className="reveal p-10 max-w-lg w-full text-center flex flex-col items-center gap-6">
            <span className="text-green-primary">
              <CheckCircleIcon />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-heading text-card text-text-primary">
                Message sent!
              </h3>
              <p className="text-body-sm text-text-secondary">
                Thanks for reaching out. I'll get back to you as soon as possible.
              </p>
            </div>
            <button
              onClick={handleSendAnother}
              className="focus-ring mt-2 px-6 py-2.5 rounded-lg border border-border-green text-green-primary font-body font-medium text-body-sm hover:bg-green-primary hover:text-bg-primary transition-colors duration-200"
            >
              Send another message
            </button>
          </GlassCard>
        </div>
      </SectionWrapper>
    )
  }

  // ── Main view ──
  return (
    <SectionWrapper id="contact">
      <div ref={sectionRef}>
        {/* Section heading */}
        <h2 className="reveal font-heading text-section text-text-primary mb-4">
          Get in Touch
        </h2>
        <p className="reveal reveal-delay-1 text-body-lg text-text-secondary mb-10 max-w-2xl">
          Have a project in mind or just want to say hello? Drop me a message and I'll
          get back to you.
        </p>

        {/* Error banner (Req 12.4, 12.5) */}
        {status === 'error' && (
          <div
            role="alert"
            className="reveal mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4"
          >
            <p className="text-body-sm text-red-400">
              Something went wrong sending your message. Please try again or email me
              directly at{' '}
              <a
                href={`mailto:${data.email}`}
                className="focus-ring underline hover:text-red-300 transition-colors"
              >
                {data.email}
              </a>
              .
            </p>
            <button
              onClick={handleDismissError}
              aria-label="Dismiss error"
              className="focus-ring flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Two-column layout — Req 12.1: lg:grid-cols-5 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── Form column (lg:col-span-3) ── */}
          <div className="lg:col-span-3 reveal reveal-delay-2">
            <GlassCard className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                <div className="flex flex-col gap-5">

                  {/* Name — Req 12.10: aria-describedby; Req 12.9: role="alert" */}
                  <Field id={ids.name} label="Name" error={errors.name}>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange('name')}
                      className={inputClass(!!errors.name)}
                    />
                  </Field>

                  {/* Email */}
                  <Field id={ids.email} label="Email address" error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange('email')}
                      className={inputClass(!!errors.email)}
                    />
                  </Field>

                  {/* Subject */}
                  <Field id={ids.subject} label="Subject" error={errors.subject}>
                    <input
                      type="text"
                      name="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleChange('subject')}
                      className={inputClass(!!errors.subject)}
                    />
                  </Field>

                  {/* Message */}
                  <Field id={ids.message} label="Message" error={errors.message}>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Your message (at least 20 characters)…"
                      value={formData.message}
                      onChange={handleChange('message')}
                      className={`${inputClass(!!errors.message)} resize-y`}
                    />
                  </Field>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="focus-ring mt-1 w-full py-3 px-6 rounded-lg bg-green-primary text-bg-primary font-heading font-semibold text-body hover:bg-green-secondary disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send message'}
                  </button>

                </div>
              </form>
            </GlassCard>
          </div>

          {/* ── Info column (lg:col-span-2) ── */}
          <div className="lg:col-span-2 flex flex-col gap-4 reveal reveal-delay-3">

            {/* Email card */}
            <GlassCard elevated className="p-5 flex items-start gap-4">
              <span className="mt-0.5 flex-shrink-0 text-green-primary">
                <EmailIcon />
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-label font-body font-medium text-text-muted uppercase tracking-wider">
                  Email
                </span>
                <a
                  href={`mailto:${data.email}`}
                  className="focus-ring text-body-sm font-body text-text-primary hover:text-green-primary transition-colors break-all"
                >
                  {data.email}
                </a>
              </div>
            </GlassCard>

            {/* Location card */}
            <GlassCard elevated className="p-5 flex items-start gap-4">
              <span className="mt-0.5 flex-shrink-0 text-green-primary">
                <LocationIcon />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-label font-body font-medium text-text-muted uppercase tracking-wider">
                  Location
                </span>
                <span className="text-body-sm font-body text-text-primary">
                  {data.location}
                </span>
              </div>
            </GlassCard>

            {/* Social links card */}
            {data.socials.length > 0 && (
              <GlassCard className="p-5 flex flex-col gap-3">
                <span className="text-label font-body font-medium text-text-muted uppercase tracking-wider">
                  Connect
                </span>
                <div className="flex flex-wrap gap-3">
                  {data.socials.map(social => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target={social.platform === 'email' ? undefined : '_blank'}
                      rel={social.platform === 'email' ? undefined : 'noopener noreferrer'}
                      aria-label={social.platform}
                      className="focus-ring capitalize px-3 py-1.5 rounded-lg text-body-sm font-body font-medium text-text-secondary border border-border-subtle hover:border-border-green hover:text-green-primary transition-colors duration-200"
                    >
                      {social.platform}
                    </a>
                  ))}
                </div>
              </GlassCard>
            )}

          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Contact
