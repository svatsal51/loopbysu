import type { Field } from 'payload'

export const seoField: Field = {
  name: 'meta',
  type: 'group',
  label: 'SEO',
  fields: [
    { name: 'title', type: 'text', admin: { description: 'Falls back to SEO defaults template if empty.' } },
    { name: 'description', type: 'textarea' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}
