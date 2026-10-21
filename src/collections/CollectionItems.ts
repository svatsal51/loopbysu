import type { CollectionConfig } from 'payload'

export const CollectionItems: CollectionConfig = {
  slug: 'collection-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'collection', 'price', 'date'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return String(data.title)
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'collections',
      required: true,
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'price',
      type: 'number',
      min: 0,
      index: true,
      admin: { position: 'sidebar', description: 'Starting price in INR. Shown as "From ₹X". Leave empty for price on request.' },
    },
    {
      name: 'material',
      type: 'select',
      index: true,
      options: ['Beads', 'Silver', 'Gold-plated', 'Brass', 'Thread', 'Pearl', 'Stone', 'Other'],
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      hooks: {
        beforeValidate: [({ value }) => (Array.isArray(value) ? value.map((t) => String(t).trim().toLowerCase()).filter(Boolean) : value)],
      },
      admin: { position: 'sidebar', description: 'Free-form filter tags (saved lowercase), e.g. minimal, gift, layered.' },
    },
    {
      name: 'body',
      type: 'richText',
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Gallery Images' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', description: 'Used to order "What\'s New" on home page.' },
    },
  ],
}
