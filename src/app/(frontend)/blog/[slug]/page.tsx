import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema, articleSchema } from '@/lib/schema'
import { getPayload as gp } from '@/lib/payload'

export const revalidate = 3600

type Params = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return docs[0]
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return buildMetadata({
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt,
    ogImage: post.meta?.ogImage || post.coverImage,
    path: `/blog/${slug}`,
    type: 'article',
  })
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const publishedAt = post.publishedAt ?? post.createdAt
  const authorName = typeof post.author === 'object' ? post.author?.name || post.author?.email : undefined
  const payload = await gp()
  const site = await payload.findGlobal({ slug: 'site-settings' })

  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Journal', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` },
  ]

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <article className="container-x section-pad max-w-3xl">
        <header>
          <span className="eyebrow">Journal</span>
          <h1 className="mt-4 text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">{post.title}</h1>
          <div className="mt-6 flex items-center gap-4 text-[10px] uppercase tracking-widest2 text-muted">
            {authorName ? <span>{authorName}</span> : null}
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
          </div>
        </header>
        <div className="bezel mt-12">
          <MediaImage
            media={post.coverImage}
            seed={slug}
            alt={post.title}
            size="og"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="bezel-core aspect-[16/9] w-full"
          />
        </div>
        <RichText data={post.body} className="mt-10" />
      </article>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={articleSchema({
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug ?? slug,
          publishedAt,
          updatedAt: post.updatedAt,
          authorName,
          siteName: site?.siteName,
        })}
      />
    </>
  )
}
