import Link from 'next/link'
import { ItemGrid } from '@/components/ItemGrid'
import { ScrollReveal } from '@/components/ScrollReveal'
import { getPayload } from '@/lib/payload'

export async function WhatsNew() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'collection-items',
    sort: '-date',
    limit: 6,
  })

  if (!docs.length) return null

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <ScrollReveal>
            <span className="eyebrow">Just in</span>
            <h2 className="mt-4 text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">
              What&apos;s <span className="italic">new</span>
            </h2>
          </ScrollReveal>
          <Link href="/search" className="btn-ghost hidden md:inline-flex">
            Browse all
          </Link>
        </div>
        <div className="mt-8 md:mt-12">
          <ItemGrid items={docs} emptyMessage="" />
        </div>
      </div>
    </section>
  )
}
