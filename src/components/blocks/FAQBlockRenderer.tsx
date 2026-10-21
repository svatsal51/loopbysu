import { JsonLd } from '@/components/JsonLd'
import { faqSchema } from '@/lib/schema'
import { ScrollReveal } from '@/components/ScrollReveal'

type FAQItem = { question: string; answer: string }
type FAQData = { heading?: string | null; items?: FAQItem[] | null }

export function FAQBlockRenderer({ block }: { block: FAQData }) {
  if (!block.items?.length) return null
  return (
    <section className="section-pad">
      <div className="container-x max-w-3xl">
        {block.heading ? (
          <ScrollReveal>
            <h2 className="mb-8 md:mb-10 text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">{block.heading}</h2>
          </ScrollReveal>
        ) : null}
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <ScrollReveal key={item.question} delay={i}>
              <details className="bezel group">
                <div className="bezel-core">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base">
                    <span>{item.question}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-lg transition-transform duration-500 ease-spring group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{item.answer}</p>
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <JsonLd data={faqSchema(block.items)} />
    </section>
  )
}
