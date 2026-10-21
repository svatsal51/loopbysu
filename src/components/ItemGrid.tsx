import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { ScrollReveal } from '@/components/ScrollReveal'
import { formatPrice } from '@/lib/search'

type Item = {
  id: number | string
  slug?: string | null
  title: string
  price?: number | null
  material?: string | null
  image?: unknown
}

export function ItemGrid({ items, emptyMessage }: { items: Item[]; emptyMessage: string }) {
  if (!items.length) return <p className="py-16 text-center text-sm text-muted">{emptyMessage}</p>

  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const price = formatPrice(item.price)
        return (
          <ScrollReveal key={item.id} delay={i % 3} className={i % 3 === 1 ? 'lg:mt-8' : ''}>
            <Link href={`/collection-item/${item.slug}`} className="group block">
              <div className="bezel transition-all duration-700 ease-spring group-hover:-translate-y-1 group-hover:shadow-lift">
                <MediaImage
                  media={item.image}
                  seed={item.slug ?? undefined}
                  alt={item.title}
                  className="bezel-core aspect-[4/5] w-full [&_img]:transition-transform [&_img]:duration-[1200ms] [&_img]:ease-spring group-hover:[&_img]:scale-105"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 px-2">
                <h3 className="font-display text-xl tracking-tight">{item.title}</h3>
                {price ? <span className="shrink-0 text-xs text-muted">{price}</span> : null}
              </div>
              {item.material ? (
                <p className="mt-1 px-2 text-[10px] uppercase tracking-widest2 text-muted">{item.material}</p>
              ) : null}
            </Link>
          </ScrollReveal>
        )
      })}
    </div>
  )
}
