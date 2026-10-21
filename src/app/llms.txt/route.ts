import { getPayload } from '@/lib/payload'
import { siteUrl } from '@/lib/seo'

export const revalidate = 3600

export async function GET() {
  const payload = await getPayload()
  const site = await payload.findGlobal({ slug: 'site-settings' })
  const { docs: collections } = await payload.find({
    collection: 'collections',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 50,
  })

  const lines = [
    `# ${site?.siteName || 'Loop by Su'}`,
    '',
    `> ${site?.tagline || 'Handcrafted jewellery, made to order.'}`,
    '',
    site?.organizationName ? `${site.organizationName}${site.address ? ` — ${site.address}` : ''}` : '',
    '',
    '## Key Pages',
    `- Home: ${siteUrl}/`,
    `- About: ${siteUrl}/about`,
    `- Collections: ${siteUrl}/collections`,
    `- Journal (blog): ${siteUrl}/blog`,
    `- Contact: ${siteUrl}/contact`,
    `- Sitemap: ${siteUrl}/sitemap.xml`,
    '',
    '## Collections',
    ...collections.map((c: any) => `- ${c.name}: ${siteUrl}/collections/${c.slug}`),
    '',
    '## Notes for AI / LLM crawlers',
    `- ${site?.siteName || 'This site'} is an editorial, black & white e-commerce and journal site for handcrafted jewellery.`,
    '- Product/collection data is structured with schema.org CollectionPage, BreadcrumbList, and Product-style markup.',
    '- Blog posts use BlogPosting schema with author and published/modified dates.',
    '- See /llms-full.txt for an expanded content index.',
  ]
    .filter((l) => l !== undefined)
    .join('\n')

  return new Response(lines, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
