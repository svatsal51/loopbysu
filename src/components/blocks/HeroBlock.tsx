import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { ScrollReveal } from '@/components/ScrollReveal'

type Hero = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  image?: unknown
  ctaLabel?: string | null
  ctaHref?: string | null
}

export function HeroBlock({ block }: { block: Hero }) {
  return (
    <section className="py-6 md:py-12">
      <div className="container-x grid items-center gap-8 md:gap-12 md:grid-cols-12 md:gap-10">
        <ScrollReveal className="md:col-span-7">
          {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
          <h1 className="mt-4 text-[2.5rem] font-light leading-[0.98] tracking-tight md:text-[5.5rem]">{block.heading}</h1>
          {block.subheading ? <p className="mt-8 max-w-md text-base leading-relaxed text-muted">{block.subheading}</p> : null}
          {block.ctaLabel && block.ctaHref ? (
            <Link href={block.ctaHref} className="btn-primary mt-12">
              {block.ctaLabel}
              <span className="btn-icon">↗</span>
            </Link>
          ) : null}
        </ScrollReveal>
        <ScrollReveal delay={2} className="md:col-span-5">
          <div className="bezel shadow-float">
            <MediaImage
              media={block.image}
              seed={block.heading}
              alt={block.heading}
              size="og"
              sizes="(min-width: 768px) 40vw, 100vw"
              priority
              className="bezel-core aspect-[4/5] w-full"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
