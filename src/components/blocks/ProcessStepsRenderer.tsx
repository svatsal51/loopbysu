import { MediaImage } from '@/components/MediaImage'
import { ScrollReveal } from '@/components/ScrollReveal'

type Step = { title: string; description?: string | null; image?: unknown }
type ProcessStepsData = { heading?: string | null; subheading?: string | null; steps?: Step[] | null }

export function ProcessStepsRenderer({ block }: { block: ProcessStepsData }) {
  if (!block.steps?.length) return null
  return (
    <section className="section-pad">
      <div className="container-x">
        <ScrollReveal className="max-w-2xl">
          <span className="eyebrow">Behind the scenes</span>
          {block.heading ? (
            <h2 className="mt-4 text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">{block.heading}</h2>
          ) : null}
          {block.subheading ? <p className="mt-6 text-muted">{block.subheading}</p> : null}
        </ScrollReveal>
        <div className="mt-8 md:mt-12 grid gap-6 md:grid-cols-4">
          {block.steps.map((step, i) => (
            <ScrollReveal as="article" key={step.title + i} delay={i} className={i % 2 === 1 ? 'md:mt-12' : ''}>
              <span className="font-display text-sm italic text-muted">{String(i + 1).padStart(2, '0')}</span>
              <div className="bezel mt-3">
                <MediaImage
                  media={step.image}
                  seed={step.title}
                  alt={step.title}
                  sizes="(min-width: 768px) 25vw, 100vw"
                  className="bezel-core aspect-square w-full"
                />
              </div>
              <h3 className="mt-5 text-xl font-light tracking-tight">{step.title}</h3>
              {step.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p> : null}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
