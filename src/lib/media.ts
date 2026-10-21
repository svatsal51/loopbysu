type MediaDoc = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null } | undefined> | null
}

/** Prefers the generated size variant (e.g. `card`, `og`), falling back to the original upload. */
export function mediaSrc(doc: unknown, size?: string): string | undefined {
  if (typeof doc !== 'object' || doc === null) return undefined
  const media = doc as MediaDoc
  return (size && media.sizes?.[size]?.url) || media.url || undefined
}

export function mediaAlt(doc: unknown, fallback = ''): string {
  if (typeof doc === 'object' && doc !== null && 'alt' in doc) {
    return (doc as MediaDoc).alt || fallback
  }
  return fallback
}
