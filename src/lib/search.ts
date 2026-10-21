import type { Where } from 'payload'

export const PAGE_SIZE = 12

export const MATERIALS = ['Beads', 'Silver', 'Gold-plated', 'Brass', 'Thread', 'Pearl', 'Stone', 'Other'] as const

export const SORTS = {
  newest: { label: 'Newest', sort: '-date' },
  'price-asc': { label: 'Price: low to high', sort: 'price' },
  'price-desc': { label: 'Price: high to low', sort: '-price' },
  title: { label: 'Name A–Z', sort: 'title' },
} as const

export type SortKey = keyof typeof SORTS

export type ItemFilters = {
  q: string
  material: string
  tag: string
  min?: number
  max?: number
  sort: SortKey
  page: number
}

type RawParams = Record<string, string | string[] | undefined>

export const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''

const toPositiveNumber = (v: string) => {
  if (v.trim() === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

/** `?page=` as an integer >= 1. */
export function parsePage(params: RawParams): number {
  const page = Math.floor(Number(first(params.page)))
  return Number.isFinite(page) && page > 0 ? page : 1
}

export function parseFilters(params: RawParams): ItemFilters {
  const material = first(params.material)
  const sort = first(params.sort)
  return {
    q: first(params.q).trim().slice(0, 100),
    material: (MATERIALS as readonly string[]).includes(material) ? material : '',
    tag: first(params.tag).trim().toLowerCase().slice(0, 40),
    min: toPositiveNumber(first(params.min)),
    max: toPositiveNumber(first(params.max)),
    sort: sort in SORTS ? (sort as SortKey) : 'newest',
    page: parsePage(params),
  }
}

export function buildItemsWhere(filters: ItemFilters, collectionId?: number | string): Where {
  const and: Where[] = []
  if (collectionId !== undefined) and.push({ collection: { equals: collectionId } })
  if (filters.q) and.push({ or: [{ title: { like: filters.q } }, { description: { like: filters.q } }] })
  if (filters.material) and.push({ material: { equals: filters.material } })
  if (filters.tag) and.push({ tags: { equals: filters.tag } })
  if (filters.min !== undefined) and.push({ price: { greater_than_equal: filters.min } })
  if (filters.max !== undefined) and.push({ price: { less_than_equal: filters.max } })
  return and.length ? { and } : {}
}

export function hasActiveFilters(f: ItemFilters) {
  return Boolean(f.q || f.material || f.tag || f.min !== undefined || f.max !== undefined || f.sort !== 'newest')
}

/** Query params for a given page, preserving the active filters. */
export function filtersToParams(f: ItemFilters, page = 1) {
  const sp = new URLSearchParams()
  if (f.q) sp.set('q', f.q)
  if (f.material) sp.set('material', f.material)
  if (f.tag) sp.set('tag', f.tag)
  if (f.min !== undefined) sp.set('min', String(f.min))
  if (f.max !== undefined) sp.set('max', String(f.max))
  if (f.sort !== 'newest') sp.set('sort', f.sort)
  if (page > 1) sp.set('page', String(page))
  return sp
}

export function filtersToQuery(f: ItemFilters, page = 1) {
  const s = filtersToParams(f, page).toString()
  return s ? `?${s}` : ''
}

export function formatPrice(price?: number | null) {
  if (price === null || price === undefined) return null
  return `From ₹${new Intl.NumberFormat('en-IN').format(price)}`
}
