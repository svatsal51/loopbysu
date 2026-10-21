'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { resend, FROM_ADDRESS } from '@/lib/resend'
import { enquiryAdminEmail, enquiryUserEmail } from '@/lib/emailTemplates'
import { isRateLimited } from '@/lib/rateLimit'

const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(120),
  email: z.string().trim().email('Enter a valid email'),
  msg: z.string().trim().min(10, 'Message is too short').max(4000),
  itemTitle: z.string().trim().min(1).max(200),
  itemUrl: z.string().trim().url(),
  company: z.string().max(0).optional().or(z.literal('')), // honeypot
})

export type EnquiryFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string>
}

export async function submitEnquiryForm(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const raw = {
    name: String(formData.get('name') || ''),
    email: String(formData.get('email') || ''),
    msg: String(formData.get('msg') || ''),
    itemTitle: String(formData.get('itemTitle') || ''),
    itemUrl: String(formData.get('itemUrl') || ''),
    company: String(formData.get('company') || ''),
  }

  if (raw.company) {
    return { status: 'success' }
  }

  const parsed = enquirySchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message
    }
    return { status: 'error', message: 'Please fix the errors below.', fieldErrors }
  }

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(`enquiry:${ip}`)) {
    return { status: 'error', message: 'Too many requests. Please try again in a minute.' }
  }

  const { name, email, msg, itemTitle, itemUrl } = parsed.data

  try {
    const payload = await getPayload()
    await payload.create({
      collection: 'contact-submissions',
      data: { source: 'enquiry', name, email, message: msg, itemTitle, itemUrl },
    })

    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    const recipient = siteSettings?.contactRecipientEmail

    if (process.env.RESEND_API_KEY && recipient) {
      const admin = enquiryAdminEmail({ name, email, message: msg, itemTitle, itemUrl })
      const user = enquiryUserEmail({ name, itemTitle, siteName: siteSettings?.siteName || 'Loop by Su' })
      await Promise.all([
        resend.emails.send({ from: FROM_ADDRESS, to: recipient, replyTo: email, ...admin }),
        resend.emails.send({ from: FROM_ADDRESS, to: email, ...user }),
      ])
    }

    return { status: 'success' }
  } catch (error) {
    console.error('Enquiry form submission failed', error)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
