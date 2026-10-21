import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { buildMetadata, siteUrl } from '@/lib/seo'
import { MediaImage } from '@/components/MediaImage'
import { mediaSrc } from '@/lib/media'
import { RichText } from '@/components/RichText'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { ScrollReveal } from '@/components/ScrollReveal'
import { breadcrumbSchema, productSchema } from '@/lib/schema'
import { formatPrice } from '@/lib/search'
import { EnquiryForm } from '@/components/EnquiryForm'

export const revalidate = 3600

type Params = { params: Promise<{ slug: string }> }

async function getItem(slug: string) {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'collection-items',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0]
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) return {}
  return buildMetadata({
    title: item.title,
    description: item.description,
    ogImage: item.image,
    path: `/collection-item/${slug}`,
  })
}

export default async function CollectionItemPage({ params }: Params) {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) notFound()

  const collectionName = typeof item.collection === 'object' ? item.collection?.name : undefined
  const collectionSlug = typeof item.collection === 'object' ? item.collection?.slug : undefined
  const gallery = [{ image: item.image }, ...(item.gallery || [])]
  const price = formatPrice(item.price)
  const tags = item.tags ?? []

  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    ...(collectionName && collectionSlug
      ? [{ name: collectionName, url: `/collections/${collectionSlug}` }]
      : []),
    { name: item.title, url: `/collection-item/${slug}` },
  ]

  const mainImage = mediaSrc(item.image, 'og')

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <article className="container-x section-pad grid gap-8 md:gap-12 md:grid-cols-12 md:gap-16">
        <div className="grid grid-cols-2 gap-3 md:col-span-7">
          {gallery.map((g, i) => (
            <ScrollReveal key={i} delay={i} className={i === 0 ? 'col-span-2' : ''}>
              <div className="bezel">
                <MediaImage
                  media={g.image}
                  seed={`${slug}-${i}`}
                  alt={`${item.title} — image ${i + 1}`}
                  size={i === 0 ? 'og' : 'card'}
                  sizes={i === 0 ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 29vw, 50vw'}
                  priority={i === 0}
                  className={`bezel-core w-full ${i === 0 ? 'aspect-[4/3]' : 'aspect-square'}`}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            {collectionName ? <span className="eyebrow">{collectionName}</span> : null}
            <h1 className="mt-4 text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">{item.title}</h1>
            {price ? <p className="mt-5 font-display text-2xl text-ink/80">{price}</p> : null}
            {item.material || tags.length ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {item.material ? (
                  <li className="rounded-full bg-shell px-3 py-1 text-[10px] uppercase tracking-[0.2em] ring-1 ring-ink/5">
                    {item.material}
                  </li>
                ) : null}
                {tags.map((t: string) => (
                  <li key={t} className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted ring-1 ring-ink/10">
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
            {item.description ? <p className="mt-8 text-muted">{item.description}</p> : null}
            {item.body ? <RichText data={item.body} className="mt-8" /> : null}

            <div className="bezel mt-12">
              <div className="bezel-core p-6 md:p-8">
                <h2 className="text-2xl font-light tracking-tight">Enquire now</h2>
                <p className="mt-2 text-sm text-muted">Interested in this piece? Send us a note and we&apos;ll reply directly.</p>
                <EnquiryForm itemTitle={item.title} itemUrl={`${siteUrl}/collection-item/${slug}`} />
              </div>
            </div>
          </div>
        </div>
      </article>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={productSchema({
          title: item.title,
          description: item.description,
          slug,
          price: item.price,
          material: item.material,
          imageUrl: mainImage ? new URL(mainImage, siteUrl).toString() : undefined,
        })}
      />
    </>
  )
}
