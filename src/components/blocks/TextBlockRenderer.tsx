import { RichText } from '@/components/RichText'
import { ScrollReveal } from '@/components/ScrollReveal'

type TextBlockData = {
  heading?: string | null
  richText: any
}

export function TextBlockRenderer({ block }: { block: TextBlockData }) {
  return (
    <section className="section-pad">
      <ScrollReveal className="container-x max-w-3xl" as="article">
        {block.heading ? (
          <h2 className="mb-4 text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[2.75rem]">{block.heading}</h2>
        ) : null}
        <RichText data={block.richText} />
      </ScrollReveal>
    </section>
  )
}
