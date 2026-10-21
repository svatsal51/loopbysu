import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { MediaImage } from '@/components/MediaImage'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Collections',
    description: 'Browse every collection — an answer to what makes each piece distinct.',
    path: '/collections',
  })
}

export default async function CollectionsPage() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'collections',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 100,
  })

  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Collections', url: '/collections' }]} />
      <header className="container-x section-pad pb-6 md:pb-8">
        <span className="eyebrow">Shop</span>
        <h1 className="mt-4 text-[2.5rem] font-light leading-[1.02] tracking-tight md:text-[5.5rem]">Collections</h1>
      </header>
      <section className="container-x pb-14 md:pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {docs.map((c: any, i: number) => (
            <ScrollReveal key={c.id} delay={i % 3} className={i % 3 === 1 ? 'md:mt-8' : ''}>
              <Link href={`/collections/${c.slug}`} className="group block">
                <div className="bezel transition-all duration-700 ease-spring group-hover:-translate-y-1 group-hover:shadow-lift">
                  <MediaImage
                    media={c.image}
                    seed={c.slug}
                    alt={c.name}
                    label={c.name}
                    className="bezel-core aspect-[4/5] w-full [&_img]:transition-transform [&_img]:duration-[1200ms] [&_img]:ease-spring group-hover:[&_img]:scale-105"
                  />
                </div>
                <h2 className="mt-5 px-2 font-display text-2xl tracking-tight">{c.name}</h2>
                {c.description ? <p className="mt-2 px-2 text-sm text-muted">{c.description}</p> : null}
              </Link>
            </ScrollReveal>
          ))}
        </div>
        {!docs.length ? <p className="text-sm text-muted">No collections yet — check back soon.</p> : null}
      </section>
    </>
  )
}
