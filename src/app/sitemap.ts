import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload'
import { siteUrl } from '@/lib/seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()

  const [pages, collections, items, posts] = await Promise.all([
    payload.find({ collection: 'pages', limit: 200 }),
    payload.find({ collection: 'collections', where: { active: { equals: true } }, limit: 200 }),
    payload.find({ collection: 'collection-items', limit: 500 }),
    payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 500 }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/collections`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: 'daily', priority: 0.7 },    { url: `${siteUrl}/contact`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const pageRoutes: MetadataRoute.Sitemap = pages.docs
    .filter((p: any) => !['home', 'about'].includes(p.slug))
    .map((p: any) => ({
      url: `${siteUrl}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))

  const collectionRoutes: MetadataRoute.Sitemap = collections.docs.map((c: any) => ({
    url: `${siteUrl}/collections/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const itemRoutes: MetadataRoute.Sitemap = items.docs.map((i: any) => ({
    url: `${siteUrl}/collection-item/${i.slug}`,
    lastModified: i.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.docs.map((p: any) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...pageRoutes, ...collectionRoutes, ...itemRoutes, ...postRoutes]
}
