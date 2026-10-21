import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'

type CTAData = {
  heading: string
  subheading?: string | null
  buttonLabel: string
  buttonHref: string
}

export function CTABlockRenderer({ block }: { block: CTAData }) {
  return (
    <section className="py-6 md:py-12">
      <ScrollReveal className="container-x">
        <div className="bezel">
          <div className="bezel-core flex flex-col items-center bg-shell px-6 py-12 text-center md:py-20">
            <h2 className="max-w-3xl text-[1.75rem] font-light leading-[1.05] tracking-tight md:text-[3.25rem]">{block.heading}</h2>
            {block.subheading ? <p className="mt-6 max-w-lg text-muted">{block.subheading}</p> : null}
            <Link href={block.buttonHref} className="btn-primary mt-12">
              {block.buttonLabel}
              <span className="btn-icon">↗</span>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
