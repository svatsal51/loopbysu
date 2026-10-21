import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { BlocksRenderer, type AnyBlock } from '@/components/blocks/BlocksRenderer'
import { WhatsNew } from '@/components/home/WhatsNew'
import { FeaturedCollections } from '@/components/home/FeaturedCollections'
import { LatestPosts } from '@/components/home/LatestPosts'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
  const page = docs[0]
  return buildMetadata({
    title: page?.meta?.title || undefined,
    description: page?.meta?.description,
    ogImage: page?.meta?.ogImage,
    path: '/',
  })
}

export default async function HomePage() {
  const payload = await getPayload()
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
  const page = docs[0]
  const blocks = (page?.layout || []) as AnyBlock[]

  const heroBlock = blocks.find((b) => b.blockType === 'hero')
  const ctaIndex = [...blocks].reverse().findIndex((b) => b.blockType === 'cta')
  const ctaBlock = ctaIndex >= 0 ? blocks[blocks.length - 1 - ctaIndex] : undefined
  const middleBlocks = blocks.filter((b) => b !== heroBlock && b !== ctaBlock)

  return (
    <>
      {heroBlock ? <BlocksRenderer blocks={[heroBlock]} /> : null}
      <WhatsNew />
      <FeaturedCollections />
      <BlocksRenderer blocks={middleBlocks} />
      <LatestPosts />
      {ctaBlock ? <BlocksRenderer blocks={[ctaBlock]} /> : null}
    </>
  )
}
