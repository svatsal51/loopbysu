import { MediaImage } from '@/components/MediaImage'
import { mediaAlt } from '@/lib/media'
import { ScrollReveal } from '@/components/ScrollReveal'

type ImageBlockData = {
  image?: unknown
  caption?: string | null
}

export function ImageBlockRenderer({ block }: { block: ImageBlockData }) {
  const alt = mediaAlt(block.image, block.caption || 'Image')
  return (
    <section className="py-6 md:py-12">
      <ScrollReveal className="container-x">
        <div className="bezel">
          <MediaImage
            media={block.image}
            seed={alt}
            alt={alt}
            size="og"
            sizes="(min-width: 1400px) 1300px, 100vw"
            className="bezel-core aspect-[16/9] w-full"
          />
        </div>
        {block.caption ? <p className="mt-5 text-center text-[10px] uppercase tracking-widest2 text-muted">{block.caption}</p> : null}
      </ScrollReveal>
    </section>
  )
}
