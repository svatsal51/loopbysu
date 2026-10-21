import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { ScrollReveal } from '@/components/ScrollReveal'

type Post = {
  slug?: string | null
  title: string
  excerpt: string
  coverImage?: unknown
  publishedAt?: string | null
  createdAt: string
}

export function PostCard({ post, delay = 0 }: { post: Post; delay?: number }) {
  const date = post.publishedAt ?? post.createdAt
  return (
    <ScrollReveal as="article" delay={delay}>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="bezel transition-all duration-700 ease-spring group-hover:-translate-y-1 group-hover:shadow-lift">
          <MediaImage
            media={post.coverImage}
            seed={post.slug ?? undefined}
            alt={post.title}
            className="bezel-core aspect-[4/3] w-full [&_img]:transition-transform [&_img]:duration-[1200ms] [&_img]:ease-spring group-hover:[&_img]:scale-105"
          />
        </div>
        <time dateTime={date} className="mt-6 block px-2 text-[10px] uppercase tracking-widest2 text-muted">
          {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </time>
        <h3 className="mt-2 px-2 font-display text-2xl leading-tight tracking-tight">{post.title}</h3>
        <p className="mt-3 px-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      </Link>
    </ScrollReveal>
  )
}
