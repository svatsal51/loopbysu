'use client'

import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from '@/app/(frontend)/contact/actions'

const initialState: ContactFormState = { status: 'idle' }

export function ContactForm({ typeOptions }: { typeOptions: { slug: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState)

  if (state.status === 'success') {
    return (
      <p className="rounded-2xl bg-shell p-6 text-sm text-ink ring-1 ring-ink/5" role="status">
        Thanks for reaching out — we&apos;ve received your message and will reply shortly.
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">Name</label>
          <input id="name" name="name" required className="field-input" />
          {state.fieldErrors?.name ? <p className="mt-1 text-xs text-ink">{state.fieldErrors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input id="email" name="email" type="email" required className="field-input" />
          {state.fieldErrors?.email ? <p className="mt-1 text-xs text-ink">{state.fieldErrors.email}</p> : null}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="field-label">Interested in</label>
          <select id="type" name="type" required className="field-input">
            <option value="">Select…</option>
            {typeOptions.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {state.fieldErrors?.type ? <p className="mt-1 text-xs text-ink">{state.fieldErrors.type}</p> : null}
        </div>
        <div>
          <label htmlFor="budgetInr" className="field-label">Approx. budget (INR)</label>
          <input id="budgetInr" name="budgetInr" inputMode="numeric" placeholder="e.g. 5000" className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">Message</label>
        <textarea id="message" name="message" rows={5} required className="field-input" />
        {state.fieldErrors?.message ? <p className="mt-1 text-xs text-ink">{state.fieldErrors.message}</p> : null}
      </div>

      {state.status === 'error' && state.message ? <p className="text-xs text-ink">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50">
        {pending ? 'Sending…' : 'Send Message'}
        <span className="btn-icon">↗</span>
      </button>
    </form>
  )
}
