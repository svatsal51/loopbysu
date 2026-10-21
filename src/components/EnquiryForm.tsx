'use client'

import { useActionState } from 'react'
import { submitEnquiryForm, type EnquiryFormState } from '@/app/(frontend)/collection-item/actions'

const initialState: EnquiryFormState = { status: 'idle' }

export function EnquiryForm({ itemTitle, itemUrl }: { itemTitle: string; itemUrl: string }) {
  const [state, formAction, pending] = useActionState(submitEnquiryForm, initialState)

  if (state.status === 'success') {
    return (
      <p className="mt-6 rounded-2xl bg-shell p-5 text-sm text-ink ring-1 ring-ink/5" role="status">
        Thanks — your enquiry has been sent. We&apos;ll be in touch soon.
      </p>
    )
  }

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <input type="hidden" name="itemTitle" value={itemTitle} />
      <input type="hidden" name="itemUrl" value={itemUrl} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="enq-name" className="field-label">Name</label>
        <input id="enq-name" name="name" required className="field-input" />
        {state.fieldErrors?.name ? <p className="mt-1 text-xs text-ink">{state.fieldErrors.name}</p> : null}
      </div>
      <div>
        <label htmlFor="enq-email" className="field-label">Email</label>
        <input id="enq-email" name="email" type="email" required className="field-input" />
        {state.fieldErrors?.email ? <p className="mt-1 text-xs text-ink">{state.fieldErrors.email}</p> : null}
      </div>
      <div>
        <label htmlFor="enq-msg" className="field-label">Message</label>
        <textarea id="enq-msg" name="msg" rows={4} required className="field-input" />
        {state.fieldErrors?.msg ? <p className="mt-1 text-xs text-ink">{state.fieldErrors.msg}</p> : null}
      </div>

      {state.status === 'error' && state.message ? <p className="text-xs text-ink">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="btn-primary w-full justify-center disabled:opacity-50">
        {pending ? 'Sending…' : 'Send enquiry'}
        <span className="btn-icon">↗</span>
      </button>
    </form>
  )
}
