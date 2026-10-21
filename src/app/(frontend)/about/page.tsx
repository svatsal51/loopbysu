import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { BlocksRenderer, type AnyBlock } from '@/components/blocks/BlocksRenderer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export const revalidate = 3600

async function getAboutPage() {
  const payload = await getPayload()
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'about' } }, limit: 1 })
  return docs[0]
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage()
  return buildMetadata({
    title: page?.meta?.title || page?.title || 'About',
    description: page?.meta?.description,
    ogImage: page?.meta?.ogImage,
    path: '/about',
  })
}

export default async function AboutPage() {
  const page = await getAboutPage()
  if (!page) notFound()
  const blocks = (page.layout || []) as AnyBlock[]

  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]} />
      <h1 className="sr-only">{page.title}</h1>
      <BlocksRenderer blocks={blocks} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }])} />
    </>
  )
}
