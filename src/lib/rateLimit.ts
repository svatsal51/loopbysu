const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

const hits = new Map<string, number[]>()

/**
 * In-memory fixed-window limiter. Fine for the free-tier single-instance
 * deploy this project targets; swap for Upstash Redis if you scale to
 * multiple serverless regions/instances.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now()
  if (hits.size > 1000) {
    // Drop keys with no recent hits so the map can't grow without bound.
    for (const [k, ts] of hits) if (ts.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
  }
  const timestamps = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS)
  timestamps.push(now)
  hits.set(key, timestamps)
  return timestamps.length > MAX_REQUESTS
}
