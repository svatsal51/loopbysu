import type { CollectionConfig } from 'payload'
import { seoField } from '@/fields/seo'
import { allBlocks } from '@/blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
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
      required: true,
      admin: { position: 'sidebar', description: '"home" and "about" are used by the frontend routes.' },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: allBlocks,
    },
    seoField,
  ],
}
