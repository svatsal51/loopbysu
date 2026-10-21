import { getPayload } from '@/lib/payload'
import { siteUrl } from '@/lib/seo'

export const revalidate = 3600

export async function GET() {
  const payload = await getPayload()
  const site = await payload.findGlobal({ slug: 'site-settings' })

  const [collections, items, posts, pages] = await Promise.all([
    payload.find({ collection: 'collections', where: { active: { equals: true } }, sort: 'order', limit: 100 }),
    payload.find({ collection: 'collection-items', sort: '-date', limit: 200 }),
    payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 200 }),
    payload.find({ collection: 'pages', limit: 50 }),
  ])

  const lines: string[] = [
    `# ${site?.siteName || 'Loop by Su'} — Full Content Index`,
    '',
    `> ${site?.tagline || ''}`,
    '',
    '## Pages',
    ...pages.docs.map((p: any) => `- ${p.title}: ${siteUrl}/${p.slug === 'home' ? '' : p.slug}`),
    '',
    '## Collections',
    ...collections.docs.map(
      (c: any) => `- ${c.name}: ${siteUrl}/collections/${c.slug}${c.description ? ` — ${c.description}` : ''}`,
    ),
    '',
    '## Collection Items',
    ...items.docs.map((i: any) => `- ${i.title}: ${siteUrl}/collection-item/${i.slug}`),
    '',
    '## Journal Posts',
    ...posts.docs.map(
      (p: any) => `- ${p.title} (${new Date(p.publishedAt).toISOString().slice(0, 10)}): ${siteUrl}/blog/${p.slug} — ${p.excerpt}`,
    ),
  ]

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
