import { describe, expect, it } from 'vitest'
import { newsletterSchema } from './validators'

describe('newsletterSchema', () => {
  it('normalises the email', () => {
    const r = newsletterSchema.safeParse({ email: '  Su@Example.COM ', company: '' })
    expect(r.success && r.data.email).toBe('su@example.com')
  })

  it('rejects invalid emails', () => {
    expect(newsletterSchema.safeParse({ email: 'nope' }).success).toBe(false)
    expect(newsletterSchema.safeParse({ email: '' }).success).toBe(false)
  })

  it('rejects a filled honeypot', () => {
    expect(newsletterSchema.safeParse({ email: 'a@b.co', company: 'bot' }).success).toBe(false)
  })
})
