import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Collections } from '@/collections/Collections'
import { CollectionItems } from '@/collections/CollectionItems'
import { Posts } from '@/collections/Posts'
import { Pages } from '@/collections/Pages'
import { ContactSubmissions } from '@/collections/ContactSubmissions'
import { NewsletterSubscribers } from '@/collections/NewsletterSubscribers'
import { SiteSettings } from '@/globals/SiteSettings'
import { SeoDefaults } from '@/globals/SeoDefaults'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || ''
const blobTokenValid = /^vercel_blob_rw_[a-zA-Z0-9]+_[a-zA-Z0-9]+$/.test(blobToken)
if (blobToken && !blobTokenValid) {
  console.warn(
    '[payload.config] BLOB_READ_WRITE_TOKEN is set but not a valid Vercel Blob token — media uploads will use local disk storage until a real token is provided.',
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Loop by Su Admin',
    },
  },
  collections: [Users, Media, Collections, CollectionItems, Posts, Pages, ContactSubmissions, NewsletterSubscribers],
  globals: [SiteSettings, SeoDefaults],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: blobTokenValid,
      collections: {
        media: true,
      },
      token: blobToken,
    }),
  ],
})
