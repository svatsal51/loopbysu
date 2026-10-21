import { MediaImage } from '@/components/MediaImage'
import { ScrollReveal } from '@/components/ScrollReveal'

type FeatureItem = { title: string; description?: string | null; image?: unknown }
type FeatureGridData = { heading?: string | null; items?: FeatureItem[] | null }

export function FeatureGridRenderer({ block }: { block: FeatureGridData }) {
  if (!block.items?.length) return null
  return (
    <section className="section-pad">
      <div className="container-x">
        {block.heading ? (
          <ScrollReveal>
            <h2 className="mb-8 md:mb-10 max-w-2xl text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">{block.heading}</h2>
          </ScrollReveal>
        ) : null}
        <div className="grid gap-6 md:grid-cols-3">
          {block.items.map((item, i) => (
            <ScrollReveal key={item.title + i} delay={i % 3} className={i % 3 === 1 ? 'md:mt-8' : ''}>
              <div className="bezel">
                <div className="bezel-core">
                  <MediaImage media={item.image} seed={item.title} alt={item.title} className="aspect-square w-full" />
                  <div className="p-6">
                    <h3 className="text-2xl font-light tracking-tight">{item.title}</h3>
                    {item.description ? <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p> : null}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
