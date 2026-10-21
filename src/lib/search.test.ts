import { describe, expect, it } from 'vitest'
import { buildItemsWhere, filtersToQuery, formatPrice, hasActiveFilters, parseFilters } from './search'

describe('parseFilters', () => {
  it('applies defaults for empty params', () => {
    expect(parseFilters({})).toEqual({ q: '', material: '', tag: '', min: undefined, max: undefined, sort: 'newest', page: 1 })
  })

  it('reads the first value of array params and trims/lowercases', () => {
    const f = parseFilters({ q: [' pearl ', 'x'], tag: ' Gift ', material: 'Silver' })
    expect(f.q).toBe('pearl')
    expect(f.tag).toBe('gift')
    expect(f.material).toBe('Silver')
  })

  it('rejects unknown materials and sorts', () => {
    const f = parseFilters({ material: 'Plutonium', sort: 'drop table' })
    expect(f.material).toBe('')
    expect(f.sort).toBe('newest')
  })

  it('sanitises prices and page numbers', () => {
    expect(parseFilters({ min: '-5', max: 'abc' })).toMatchObject({ min: undefined, max: undefined })
    expect(parseFilters({ min: '0', max: '1500' })).toMatchObject({ min: 0, max: 1500 })
    expect(parseFilters({ page: '0' }).page).toBe(1)
    expect(parseFilters({ page: '-3' }).page).toBe(1)
    expect(parseFilters({ page: '2.9' }).page).toBe(2)
    expect(parseFilters({ page: 'NaN' }).page).toBe(1)
  })
})

describe('buildItemsWhere', () => {
  it('is empty without filters', () => {
    expect(buildItemsWhere(parseFilters({}))).toEqual({})
  })

  it('combines all filters with and', () => {
    const where = buildItemsWhere(parseFilters({ q: 'ring', material: 'Brass', tag: 'gift', min: '100', max: '900' }), 7)
    expect(where).toEqual({
      and: [
        { collection: { equals: 7 } },
        { or: [{ title: { like: 'ring' } }, { description: { like: 'ring' } }] },
        { material: { equals: 'Brass' } },
        { tags: { equals: 'gift' } },
        { price: { greater_than_equal: 100 } },
        { price: { less_than_equal: 900 } },
      ],
    })
  })

  it('treats min 0 as an active bound', () => {
    expect(buildItemsWhere(parseFilters({ min: '0' }))).toEqual({ and: [{ price: { greater_than_equal: 0 } }] })
  })
})

describe('filtersToQuery / hasActiveFilters', () => {
  it('round-trips active filters and omits defaults', () => {
    const f = parseFilters({ q: 'a b', sort: 'price-asc', min: '10' })
    expect(filtersToQuery(f)).toBe('?q=a+b&min=10&sort=price-asc')
    expect(filtersToQuery(f, 3)).toBe('?q=a+b&min=10&sort=price-asc&page=3')
    expect(filtersToQuery(parseFilters({}))).toBe('')
  })

  it('detects active filters', () => {
    expect(hasActiveFilters(parseFilters({}))).toBe(false)
    expect(hasActiveFilters(parseFilters({ sort: 'title' }))).toBe(true)
    expect(hasActiveFilters(parseFilters({ min: '0' }))).toBe(true)
  })
})

describe('formatPrice', () => {
  it('formats INR with Indian grouping', () => {
    expect(formatPrice(1499)).toBe('From ₹1,499')
    expect(formatPrice(125000)).toBe('From ₹1,25,000')
  })
  it('returns null when there is no price', () => {
    expect(formatPrice(null)).toBeNull()
    expect(formatPrice(undefined)).toBeNull()
  })
})

describe('parsePage / filtersToParams', () => {
  it('parses page independently of filters', async () => {
    const { parsePage } = await import('./search')
    expect(parsePage({ page: '4' })).toBe(4)
    expect(parsePage({ page: 'x' })).toBe(1)
    expect(parsePage({})).toBe(1)
  })

  it('returns URLSearchParams usable for pagination links', async () => {
    const { filtersToParams } = await import('./search')
    const sp = filtersToParams(parseFilters({ q: 'a', material: 'Brass', page: '2' }), 2)
    expect(sp.get('q')).toBe('a')
    expect(sp.get('material')).toBe('Brass')
    expect(sp.get('page')).toBe('2')
  })
})
