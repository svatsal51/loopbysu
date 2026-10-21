import Image from 'next/image'
import { GradientTile } from '@/components/GradientTile'
import { mediaAlt, mediaSrc } from '@/lib/media'

type Props = {
  /** Populated Payload media doc (depth >= 1). Falls back to a gradient when missing. */
  media?: unknown
  alt: string
  /** Seed for the gradient fallback. */
  seed?: string
  /** Wrapper classes: size, aspect ratio and radius. */
  className?: string
  /** Generated Media size to prefer, e.g. `card` or `og`. */
  size?: string
  sizes?: string
  priority?: boolean
  label?: string
}

export function MediaImage({ media, alt, seed, className = '', size = 'card', sizes, priority, label }: Props) {
  const src = mediaSrc(media, size)
  if (!src) return <GradientTile seed={seed} alt={alt} className={className} label={label} />

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={mediaAlt(media, alt)}
        fill
        sizes={sizes ?? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
        priority={priority}
        className="object-cover"
      />
    </div>
  )
}
