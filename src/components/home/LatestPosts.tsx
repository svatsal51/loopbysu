import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { ScrollReveal } from '@/components/ScrollReveal'
import { getPayload } from '@/lib/payload'

export async function LatestPosts() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 3,
  })

  if (!docs.length) return null

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <ScrollReveal>
            <span className="eyebrow">Journal</span>
            <h2 className="mt-4 text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">Latest posts</h2>
          </ScrollReveal>
          <Link href="/blog" className="btn-ghost hidden md:inline-flex">
            View all
          </Link>
        </div>
        <div className="mt-8 md:mt-12 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {docs.map((post: any, i: number) => (
            <PostCard key={post.id} post={post} delay={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
