import { z } from 'zod'

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(254),
  company: z.string().max(0).optional(), // honeypot
})
