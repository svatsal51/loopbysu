'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { resend, FROM_ADDRESS } from '@/lib/resend'
import { contactAdminEmail, contactUserEmail } from '@/lib/emailTemplates'
import { isRateLimited } from '@/lib/rateLimit'

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(120),
  email: z.string().trim().email('Enter a valid email'),
  type: z.string().trim().min(1, 'Select what you\'re interested in').max(60),
  budgetInr: z.string().trim().max(30).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message is too short').max(4000),
  company: z.string().max(0).optional().or(z.literal('')), // honeypot
})

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string>
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get('name') || ''),
    email: String(formData.get('email') || ''),
    type: String(formData.get('type') || ''),
    budgetInr: String(formData.get('budgetInr') || ''),
    message: String(formData.get('message') || ''),
    company: String(formData.get('company') || ''),
  }

  if (raw.company) {
    // Honeypot tripped — silently pretend success to the bot.
    return { status: 'success' }
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message
    }
    return { status: 'error', message: 'Please fix the errors below.', fieldErrors }
  }

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(`contact:${ip}`)) {
    return { status: 'error', message: 'Too many requests. Please try again in a minute.' }
  }

  const { name, email, type, budgetInr, message } = parsed.data

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'contact-submissions',
      data: { source: 'contact', name, email, type, budgetInr: budgetInr || undefined, message },
    })

    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    const recipient = siteSettings?.contactRecipientEmail

    if (process.env.RESEND_API_KEY && recipient) {
      const admin = contactAdminEmail({ name, email, type, budgetInr, message })
      const user = contactUserEmail({ name, siteName: siteSettings?.siteName || 'Loop by Su' })
      await Promise.all([
        resend.emails.send({ from: FROM_ADDRESS, to: recipient, replyTo: email, ...admin }),
        resend.emails.send({ from: FROM_ADDRESS, to: email, ...user }),
      ])
    }

    return { status: 'success' }
  } catch (error) {
    console.error('Contact form submission failed', error)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
