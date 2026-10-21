import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    description: 'Read-only list of newsletter signups. Created only via the public site.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'source',
      type: 'select',
      options: ['footer', 'other'],
      defaultValue: 'footer',
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
