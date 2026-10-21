import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { mediaSrc } from '@/lib/media'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type MetaInput = {
  title?: string | null
  description?: string | null
  ogImage?: unknown
  path: string
  type?: 'website' | 'article'
}

export async function buildMetadata({ title, description, ogImage, path, type = 'website' }: MetaInput): Promise<Metadata> {
  const payload = await getPayload()
  const seoDefaults = await payload.findGlobal({ slug: 'seo-defaults' })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' })

  const template = seoDefaults?.defaultMetaTitleTemplate || '%s | Loop by Su'
  const resolvedTitle = title
    ? template.replace('%s', title)
    : siteSettings?.siteName || 'Loop by Su'
  const resolvedDescription = description || seoDefaults?.defaultMetaDescription || siteSettings?.tagline || ''
  const image = mediaSrc(ogImage) || mediaSrc(siteSettings?.defaultOgImage)
  const url = `${siteUrl}${path}`

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: siteSettings?.siteName || 'Loop by Su',
      type,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      site: seoDefaults?.twitterHandle || undefined,
      images: image ? [image] : undefined,
    },
  }
}
