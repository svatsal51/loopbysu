import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { ItemFilterBar } from '@/components/ItemFilterBar'
import { ItemGrid } from '@/components/ItemGrid'
import { Pagination } from '@/components/Pagination'
import { breadcrumbSchema, collectionPageSchema } from '@/lib/schema'
import { PAGE_SIZE, SORTS, buildItemsWhere, filtersToParams, parseFilters } from '@/lib/search'

type Params = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getCollection(slug: string) {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'collections',
    where: { and: [{ slug: { equals: slug } }, { active: { not_equals: false } }] },
    limit: 1,
  })
  return docs[0]
}

export async function generateMetadata({ params }: Pick<Params, 'params'>): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollection(slug)
  if (!collection) return {}
  return buildMetadata({
    title: collection.name,
    description: collection.description,
    ogImage: collection.image,
    path: `/collections/${slug}`,
  })
}

export default async function CollectionDetailPage({ params, searchParams }: Params) {
  const { slug } = await params
  const collection = await getCollection(slug)
  if (!collection) notFound()

  const filters = parseFilters(await searchParams)
  const payload = await getPayload()
  const { docs: items, totalPages, totalDocs, page } = await payload.find({
    collection: 'collection-items',
    where: buildItemsWhere(filters, collection.id),
    sort: SORTS[filters.sort].sort,
    limit: PAGE_SIZE,
    page: filters.page,
  })

  const path = `/collections/${slug}`
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    { name: collection.name, url: path },
  ]

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <header className="container-x section-pad pb-6 md:pb-8">
        <span className="eyebrow">Collection</span>
        <h1 className="mt-4 text-[2.5rem] font-light leading-[1.02] tracking-tight md:text-[5.5rem]">{collection.name}</h1>
        {collection.description ? <p className="mt-6 max-w-xl text-muted">{collection.description}</p> : null}
      </header>
      <section className="container-x pb-14 md:pb-20">
        <ItemFilterBar action={path} filters={filters} />
        <p className="mb-6 mt-6 text-xs text-muted" aria-live="polite">
          {totalDocs} {totalDocs === 1 ? 'piece' : 'pieces'}
        </p>
        <ItemGrid items={items} emptyMessage="No pieces match these filters." />
        <Pagination basePath={path} params={filtersToParams(filters)} page={page ?? 1} totalPages={totalPages} />
      </section>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={collectionPageSchema(collection.name, path)} />
    </>
  )
}
