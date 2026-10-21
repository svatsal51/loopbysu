export function contactAdminEmail(data: {
  name: string
  email: string
  type: string
  budgetInr?: string
  message: string
}) {
  return {
    subject: `New contact enquiry — ${data.name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Interested in:</strong> ${escapeHtml(data.type)}</p>
      ${data.budgetInr ? `<p><strong>Approx. budget:</strong> ₹${escapeHtml(data.budgetInr)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br/>')}</p>
    `,
  }
}

export function contactUserEmail(data: { name: string; siteName: string }) {
  return {
    subject: `We received your message — ${data.siteName}`,
    html: `
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Thanks for reaching out to ${escapeHtml(data.siteName)}. We've received your message and will get back to you shortly.</p>
      <p>— ${escapeHtml(data.siteName)}</p>
    `,
  }
}

export function enquiryAdminEmail(data: {
  name: string
  email: string
  message: string
  itemTitle: string
  itemUrl: string
}) {
  return {
    subject: `New enquiry — ${data.itemTitle}`,
    html: `
      <h2>New item enquiry</h2>
      <p><strong>Item:</strong> <a href="${escapeHtml(data.itemUrl)}">${escapeHtml(data.itemTitle)}</a></p>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br/>')}</p>
    `,
  }
}

export function enquiryUserEmail(data: { name: string; itemTitle: string; siteName: string }) {
  return {
    subject: `We received your enquiry — ${data.itemTitle}`,
    html: `
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Thanks for your interest in <strong>${escapeHtml(data.itemTitle)}</strong>. We've received your enquiry and will reply shortly.</p>
      <p>— ${escapeHtml(data.siteName)}</p>
    `,
  }
}

export function newsletterWelcomeEmail(data: { siteName: string }) {
  return {
    subject: `Welcome to ${data.siteName}`,
    html: `
      <p>Thanks for subscribing to ${escapeHtml(data.siteName)}.</p>
      <p>You'll hear from us when new pieces are made and when there's a story from the studio worth sharing. No spam, ever.</p>
      <p>— ${escapeHtml(data.siteName)}</p>
    `,
  }
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
