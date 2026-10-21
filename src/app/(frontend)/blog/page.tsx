import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { PostCard } from '@/components/PostCard'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { parsePage } from '@/lib/search'

const POSTS_PER_PAGE = 9

type SearchParams = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Journal',
    description: 'Stories, techniques, and notes from the studio.',
    path: '/blog',
  })
}

export default async function BlogPage({ searchParams }: SearchParams) {
  const currentPage = parsePage(await searchParams)
  const payload = await getPayload()
  const { docs, totalPages, page } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: POSTS_PER_PAGE,
    page: currentPage,
  })

  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Journal', url: '/blog' }]} />
      <header className="container-x section-pad pb-6 md:pb-8">
        <span className="eyebrow">Journal</span>
        <h1 className="mt-4 text-[2.5rem] font-light leading-[1.02] tracking-tight md:text-[5.5rem]">
          Notes from the <span className="italic">studio</span>
        </h1>
      </header>
      <section className="container-x pb-14 md:pb-20">
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
          {docs.map((post: any, i: number) => (
            <PostCard key={post.id} post={post} delay={i % 3} />
          ))}
        </div>
        {!docs.length ? <p className="text-sm text-muted">No posts published yet.</p> : null}
        <Pagination basePath="/blog" page={page ?? 1} totalPages={totalPages} />
      </section>
    </>
  )
}
