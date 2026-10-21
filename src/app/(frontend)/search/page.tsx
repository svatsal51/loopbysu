import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ItemFilterBar } from '@/components/ItemFilterBar'
import { ItemGrid } from '@/components/ItemGrid'
import { Pagination } from '@/components/Pagination'
import { PAGE_SIZE, SORTS, buildItemsWhere, filtersToParams, first, parseFilters } from '@/lib/search'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Search',
    description: 'Search handcrafted jewellery by name, material, tag and price.',
    path: '/search',
  }),
  robots: { index: false, follow: true },
}

const crumbs = [
  { name: 'Home', url: '/' },
  { name: 'Search', url: '/search' },
]

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const filters = parseFilters(params)
  const collectionSlug = first(params.collection)

  const payload = await getPayload()
  const { docs: collections } = await payload.find({
    collection: 'collections',
    where: { active: { not_equals: false } },
    sort: 'order',
    limit: 100,
  })
  const selected = collections.find((c) => c.slug === collectionSlug)

  const { docs: items, totalPages, totalDocs, page } = await payload.find({
    collection: 'collection-items',
    where: buildItemsWhere(filters, selected?.id),
    sort: SORTS[filters.sort].sort,
    limit: PAGE_SIZE,
    page: filters.page,
  })

  const searchParamsWithCollection = filtersToParams(filters)
  if (selected?.slug) searchParamsWithCollection.set('collection', selected.slug)

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <header className="container-x section-pad pb-6 md:pb-8">
        <span className="eyebrow">Search</span>
        <h1 className="mt-4 text-[2.5rem] font-light leading-[1.02] tracking-tight md:text-[5.5rem]">Find a piece</h1>
      </header>
      <section className="container-x pb-14 md:pb-20">
        <ItemFilterBar
          action="/search"
          filters={filters}
          collections={collections.map((c) => ({ slug: c.slug as string, name: c.name }))}
          collection={selected?.slug ?? ''}
        />
        <p className="mb-6 mt-6 text-xs text-muted" aria-live="polite">
          {totalDocs} {totalDocs === 1 ? 'piece' : 'pieces'}
        </p>
        <ItemGrid items={items} emptyMessage="Nothing matched. Try fewer filters." />
        <Pagination basePath="/search" params={searchParamsWithCollection} page={page ?? 1} totalPages={totalPages} />
      </section>
    </>
  )
}
