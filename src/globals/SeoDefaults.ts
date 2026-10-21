import type { GlobalConfig } from 'payload'

export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'defaultMetaTitleTemplate',
      type: 'text',
      defaultValue: '%s | Loop by Su',
      admin: { description: 'Use %s as the page-title placeholder.' },
    },
    { name: 'defaultMetaDescription', type: 'textarea' },
    { name: 'twitterHandle', type: 'text' },
  ],
}
