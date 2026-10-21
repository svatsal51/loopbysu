'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter, type NewsletterFormState } from '@/app/(frontend)/newsletter/actions'

const initialState: NewsletterFormState = { status: 'idle' }

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState)

  if (state.status === 'success') {
    return (
      <p className="rounded-full bg-shell px-6 py-4 text-sm text-ink ring-1 ring-ink/5" role="status">
        You&apos;re on the list. Thank you.
      </p>
    )
  }

  return (
    <form action={formAction} className="w-full max-w-md">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="nl-company">Company</label>
        <input id="nl-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center rounded-full bg-shell p-1.5 pl-6 ring-1 ring-ink/5 transition-all duration-500 ease-spring focus-within:bg-paper focus-within:shadow-float focus-within:ring-2 focus-within:ring-ink/70">
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
        />
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-[11px] uppercase tracking-[0.16em] text-paper transition-all duration-700 ease-spring hover:bg-soft active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? 'Joining…' : 'Join'}
          <span className="btn-icon h-7 w-7">↗</span>
        </button>
      </div>
      {state.status === 'error' && state.message ? (
        <p className="mt-3 pl-6 text-xs text-muted" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
