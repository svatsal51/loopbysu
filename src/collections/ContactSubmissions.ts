import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'type', 'source', 'createdAt'],
    description: 'Read-only log of public contact & enquiry form submissions. Created only via the public site.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      options: ['contact', 'enquiry'],
      required: true,
      admin: { position: 'sidebar' },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text' },
    {
      name: 'type',
      type: 'text',
      admin: { description: 'Collection slug chosen in the contact dropdown (e.g. bracelet, necklace, earrings) or "other".' },
    },
    { name: 'budgetInr', type: 'text', admin: { description: 'Approx. budget in INR, contact form only.' } },
    { name: 'itemTitle', type: 'text', admin: { description: 'Item title, enquiry form only.' } },
    { name: 'itemUrl', type: 'text', admin: { description: 'Item URL, enquiry form only.' } },
    { name: 'message', type: 'textarea', required: true },
  ],
  timestamps: true,
}
