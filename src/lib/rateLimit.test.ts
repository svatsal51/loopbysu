import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isRateLimited } from './rateLimit'

describe('isRateLimited', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('allows 5 requests per minute then blocks', () => {
    const results = Array.from({ length: 6 }, () => isRateLimited('t:block'))
    expect(results).toEqual([false, false, false, false, false, true])
  })

  it('tracks keys independently', () => {
    for (let i = 0; i < 6; i++) isRateLimited('t:a')
    expect(isRateLimited('t:b')).toBe(false)
  })

  it('recovers after the window passes', () => {
    for (let i = 0; i < 6; i++) isRateLimited('t:recover')
    vi.advanceTimersByTime(61_000)
    expect(isRateLimited('t:recover')).toBe(false)
  })
})
