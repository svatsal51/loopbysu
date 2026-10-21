import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Loop by Su' },
    { name: 'tagline', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'contactRecipientEmail', type: 'email', required: true },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'github', type: 'text' },
        { name: 'instagram', type: 'text' },
      ],
    },
    { name: 'organizationName', type: 'text', required: true, defaultValue: 'Loop by Su' },
    { name: 'address', type: 'text' },
    { name: 'foundingYear', type: 'number' },
  ],
}
