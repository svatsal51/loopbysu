'use server'

import { headers } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { resend, FROM_ADDRESS } from '@/lib/resend'
import { newsletterWelcomeEmail } from '@/lib/emailTemplates'
import { isRateLimited } from '@/lib/rateLimit'
import { newsletterSchema } from '@/lib/validators'

export type NewsletterFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function subscribeToNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const raw = {
    email: String(formData.get('email') || ''),
    company: String(formData.get('company') || ''),
  }

  if (raw.company) {
    // Honeypot tripped — silently pretend success to the bot.
    return { status: 'success' }
  }

  const parsed = newsletterSchema.safeParse(raw)
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message || 'Enter a valid email' }
  }

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(`newsletter:${ip}`)) {
    return { status: 'error', message: 'Too many requests. Please try again in a minute.' }
  }

  const { email } = parsed.data

  try {
    const payload = await getPayload()
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })
    // Already subscribed: report success without a second email, so the form can't be used to probe the list.
    if (existing.docs.length) return { status: 'success' }

    await payload.create({ collection: 'newsletter-subscribers', data: { email, source: 'footer' } })

    // The subscriber is saved; a failed welcome email must not turn that into an error.
    if (process.env.RESEND_API_KEY) {
      try {
        const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
        const welcome = newsletterWelcomeEmail({ siteName: siteSettings?.siteName || 'Loop by Su' })
        await resend.emails.send({ from: FROM_ADDRESS, to: email, ...welcome })
      } catch (error) {
        console.error('Newsletter welcome email failed', error)
      }
    }

    return { status: 'success' }
  } catch (error) {
    console.error('Newsletter signup failed', error)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
