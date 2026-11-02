import type { ContactFormData, ContactFormErrors } from '../types'

export function validateForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!data.name.trim()) {
    errors.name = 'Name is required'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!emailPattern.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!data.subject.trim()) {
    errors.subject = 'Subject is required'
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required'
  } else if (data.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters'
  }

  return errors
}
