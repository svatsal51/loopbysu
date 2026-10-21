import { describe, expect, it } from 'vitest'
import { contactAdminEmail, enquiryAdminEmail, escapeHtml, newsletterWelcomeEmail } from './emailTemplates'

describe('escapeHtml', () => {
  it('escapes markup characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#039;&amp;&#039;&lt;/a&gt;')
  })
})

describe('email templates', () => {
  it('escapes user input in the contact admin email', () => {
    const { html } = contactAdminEmail({ name: '<b>x</b>', email: 'a@b.co', type: 'ring', message: 'hi\n<script>' })
    expect(html).not.toContain('<b>x</b>')
    expect(html).not.toContain('<script>')
    expect(html).toContain('hi<br/>&lt;script&gt;')
  })

  it('escapes the item url in the enquiry email', () => {
    const { html } = enquiryAdminEmail({ name: 'n', email: 'a@b.co', message: 'm', itemTitle: 't', itemUrl: '"><img>' })
    expect(html).not.toContain('"><img>')
  })

  it('names the site in the newsletter welcome', () => {
    const { subject, html } = newsletterWelcomeEmail({ siteName: 'Loop by Su' })
    expect(subject).toBe('Welcome to Loop by Su')
    expect(html).toContain('Loop by Su')
  })
})
