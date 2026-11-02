import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fc from 'fast-check'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { personal } from '../../data/personal'
import Contact from './Contact'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderContact = () => {
  const result = render(<Contact data={personal} />)
  const form = result.container.querySelector('form') as HTMLFormElement
  return { ...result, form, inForm: within(form) }
}

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe('Contact – Req 12.1: layout and form fields', () => {
  it('renders the contact form with name, email, subject, and message fields', () => {
    const { inForm } = renderContact()
    expect(inForm.getByLabelText(/name/i)).toBeTruthy()
    expect(inForm.getByLabelText(/email/i)).toBeTruthy()
    expect(inForm.getByLabelText(/subject/i)).toBeTruthy()
    expect(inForm.getByLabelText(/message/i)).toBeTruthy()
  })

  it('renders email and location contact info', () => {
    renderContact()
    expect(screen.getByText(personal.email)).toBeTruthy()
    expect(screen.getByText(personal.location)).toBeTruthy()
  })

  it('has the section wrapper with id="contact"', () => {
    renderContact()
    const section = document.querySelector('#contact')
    expect(section).not.toBeNull()
  })
})

describe('Contact – Req 12.9 / 12.10: inline validation errors', () => {
  it('shows required errors with role="alert" when submitting empty form', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.click(screen.getByRole('button', { name: /send message/i }))

    const alerts = await screen.findAllByRole('alert')
    expect(alerts.length).toBeGreaterThanOrEqual(4)
  })

  it('shows "Name is required" when name is blank', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Name is required')).toBeTruthy()
  })

  it('shows "Email is required" when email is blank', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Email is required')).toBeTruthy()
  })

  it('shows invalid email error for malformed email', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await user.type(inForm.getByLabelText(/name/i), 'Test')
    await user.type(inForm.getByLabelText(/email/i), 'not-an-email')
    await user.type(inForm.getByLabelText(/subject/i), 'Test subject')
    await user.type(inForm.getByLabelText(/message/i), 'A message that is long enough to pass.')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Please enter a valid email address')).toBeTruthy()
  })

  it('shows message length error when message is < 20 chars', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await user.type(inForm.getByLabelText(/name/i), 'Test')
    await user.type(inForm.getByLabelText(/email/i), 'test@example.com')
    await user.type(inForm.getByLabelText(/subject/i), 'Test subject')
    await user.type(inForm.getByLabelText(/message/i), 'Short')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Message must be at least 20 characters')).toBeTruthy()
  })

  it('links input to its error via aria-describedby (Req 12.10)', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText('Name is required')

    const nameInput = inForm.getByLabelText(/name/i)
    const describedById = nameInput.getAttribute('aria-describedby')
    expect(describedById).not.toBeNull()

    const errorEl = document.getElementById(describedById!)
    expect(errorEl).not.toBeNull()
    expect(errorEl!.textContent).toContain('Name is required')
  })

  it('sets aria-invalid on invalid fields', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await user.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByText('Name is required')

    const nameInput = inForm.getByLabelText(/name/i)
    expect(nameInput.getAttribute('aria-invalid')).toBe('true')
  })
})

describe('Contact – Req 12.8: clear error on field change', () => {
  it('clears name error when user types into the name field', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await user.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByText('Name is required')

    await user.type(inForm.getByLabelText(/name/i), 'A')
    expect(screen.queryByText('Name is required')).toBeNull()
  })

  it("only clears the changed field's error, not others", async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await user.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByText('Name is required')
    await screen.findByText('Email is required')

    await user.type(inForm.getByLabelText(/name/i), 'A')

    expect(screen.queryByText('Name is required')).toBeNull()
    expect(screen.getByText('Email is required')).toBeTruthy()
  })
})

describe('Contact – Req 12.2 / 12.11: form submission', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    cleanup()
  })

  it('does not call fetch when the form is invalid', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(vi.mocked(fetch)).not.toHaveBeenCalled()
  })

  it('shows "Sending…" on the submit button during submission', async () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => { /* never resolves */ }))
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await user.type(inForm.getByLabelText(/name/i), 'Alice')
    await user.type(inForm.getByLabelText(/email/i), 'alice@example.com')
    await user.type(inForm.getByLabelText(/subject/i), 'Hello there')
    await user.type(inForm.getByLabelText(/message/i), 'This message is definitely long enough.')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByRole('button', { name: /sending/i })).toBeTruthy()
  })

  it('disables the submit button during submission', async () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => { /* never resolves */ }))
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await user.type(inForm.getByLabelText(/name/i), 'Alice')
    await user.type(inForm.getByLabelText(/email/i), 'alice@example.com')
    await user.type(inForm.getByLabelText(/subject/i), 'Hello there')
    await user.type(inForm.getByLabelText(/message/i), 'This message is definitely long enough.')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    const btn = screen.getByRole('button', { name: /sending/i }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })
})

describe('Contact – Req 12.3: success state', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    cleanup()
  })

  const fillAndSubmit = async (
    user: ReturnType<typeof userEvent.setup>,
    inForm: ReturnType<typeof within>
  ) => {
    await user.type(inForm.getByLabelText(/name/i), 'Alice')
    await user.type(inForm.getByLabelText(/email/i), 'alice@example.com')
    await user.type(inForm.getByLabelText(/subject/i), 'Hello there')
    await user.type(inForm.getByLabelText(/message/i), 'This message is definitely long enough.')
    await user.click(screen.getByRole('button', { name: /send message/i }))
  }

  it('shows success confirmation after a successful submission', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await fillAndSubmit(user, inForm)

    expect(await screen.findByText(/message sent/i)).toBeTruthy()
  })

  it('offers a "Send another message" button in success state (Req 12.5)', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await fillAndSubmit(user, inForm)
    await screen.findByText(/message sent/i)

    const resetBtn = screen.getByRole('button', { name: /send another/i })
    await user.click(resetBtn)

    expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy()
  })
})

describe('Contact – Req 12.4 / 12.5: error state', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    cleanup()
  })

  const fillAndSubmit = async (
    user: ReturnType<typeof userEvent.setup>,
    inForm: ReturnType<typeof within>
  ) => {
    await user.type(inForm.getByLabelText(/name/i), 'Alice')
    await user.type(inForm.getByLabelText(/email/i), 'alice@example.com')
    await user.type(inForm.getByLabelText(/subject/i), 'Hello there')
    await user.type(inForm.getByLabelText(/message/i), 'This message is definitely long enough.')
    await user.click(screen.getByRole('button', { name: /send message/i }))
  }

  it('shows a dismissible error banner after a failed submission', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await fillAndSubmit(user, inForm)

    const banner = await screen.findByRole('alert')
    expect(banner).toBeTruthy()
  })

  it('dismisses the error banner when the close button is clicked', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await fillAndSubmit(user, inForm)
    await screen.findByRole('alert')

    const dismissBtn = screen.getByRole('button', { name: /dismiss error/i })
    await user.click(dismissBtn)

    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull()
    })
  })

  it('returns to idle state after dismissing the error', async () => {
    const user = userEvent.setup()
    const { inForm } = renderContact()

    await fillAndSubmit(user, inForm)
    await screen.findByRole('alert')

    await user.click(screen.getByRole('button', { name: /dismiss error/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy()
    })
  })
})

// ─── Property-based tests ─────────────────────────────────────────────────────

/**
 * **Validates: Requirements 12.1**
 *
 * Property: For any PersonalData email + location, Contact always renders a
 * form with ≥4 inputs and displays both pieces of contact info.
 */
describe('Contact – property: renders required info for any PersonalData', () => {
  it('always shows email, location, and the four form fields', () => {
    const emailArb = fc.tuple(
      fc.stringMatching(/^[a-z]{2,8}$/),
      fc.stringMatching(/^[a-z]{2,8}$/),
      fc.stringMatching(/^[a-z]{2,4}$/),
    ).map(([u, domain, tld]) => `${u}@${domain}.${tld}`)

    fc.assert(
      fc.property(
        emailArb,
        fc.string({ minLength: 2, maxLength: 40 }).filter(s => s.trim().length > 1),
        (email, location) => {
          const { container } = render(
            <Contact data={{ ...personal, email, location }} />
          )

          const hasEmail = container.textContent?.includes(email) ?? false
          const hasLocation = container.textContent?.includes(location) ?? false
          const form = container.querySelector('form')
          const inputs = form ? form.querySelectorAll('input, textarea') : []

          cleanup()
          return hasEmail && hasLocation && inputs.length >= 4
        }
      ),
      { numRuns: 50 }
    )
  })
})

/**
 * **Validates: Requirements 12.8, 12.9**
 *
 * Property: Submitting the form with all fields empty always produces at least
 * one role="alert" error element — validation always fires.
 */
describe('Contact – property: empty submission always produces validation errors', () => {
  it('always shows at least one alert when all fields are empty', async () => {
    for (let i = 0; i < 5; i++) {
      const user = userEvent.setup()
      const { container } = render(<Contact data={personal} />)

      const submitBtn = container.querySelector('button[type="submit"]') as HTMLElement
      await user.click(submitBtn)

      const alerts = await screen.findAllByRole('alert')
      expect(alerts.length).toBeGreaterThanOrEqual(1)
      cleanup()
    }
  })
})
