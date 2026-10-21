import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { ScrollReveal } from '@/components/ScrollReveal'
import { getPayload } from '@/lib/payload'

export async function FeaturedCollections() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'collections',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 6,
  })

  if (!docs.length) return null

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <ScrollReveal>
            <span className="eyebrow">Shop by</span>
            <h2 className="mt-4 text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">Featured collections</h2>
          </ScrollReveal>
          <Link href="/collections" className="btn-ghost hidden md:inline-flex">
            View all
          </Link>
        </div>
        <div className="mt-8 md:mt-12 grid gap-6 md:grid-cols-3">
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
                <h3 className="mt-5 px-2 font-display text-2xl tracking-tight">{c.name}</h3>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
