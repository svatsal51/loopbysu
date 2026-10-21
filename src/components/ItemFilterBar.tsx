import { MATERIALS, SORTS, hasActiveFilters, type ItemFilters } from '@/lib/search'

type Props = {
  /** Path the GET form submits to. */
  action: string
  filters: ItemFilters
  /** When set, shows a collection picker (used on /search). */
  collections?: { slug: string; name: string }[]
  collection?: string
}

export function ItemFilterBar({ action, filters, collections, collection }: Props) {
  const active = hasActiveFilters(filters) || Boolean(collection)

  return (
    <form action={action} method="GET" role="search" className="bezel">
      <div className="bezel-core grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-6 lg:p-6">
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="f-q" className="field-label">
            Search
          </label>
          <input id="f-q" name="q" defaultValue={filters.q} placeholder="Name or description" className="field-input" />
        </div>

        {collections ? (
          <div>
            <label htmlFor="f-collection" className="field-label">
              Collection
            </label>
            <select id="f-collection" name="collection" defaultValue={collection ?? ''} className="field-input">
              <option value="">All</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label htmlFor="f-material" className="field-label">
            Material
          </label>
          <select id="f-material" name="material" defaultValue={filters.material} className="field-input">
            <option value="">Any</option>
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-tag" className="field-label">
            Tag
          </label>
          <input id="f-tag" name="tag" defaultValue={filters.tag} placeholder="e.g. gift" className="field-input" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="f-min" className="field-label">
              Min ₹
            </label>
            <input id="f-min" name="min" type="number" min={0} inputMode="numeric" defaultValue={filters.min} className="field-input" />
          </div>
          <div>
            <label htmlFor="f-max" className="field-label">
              Max ₹
            </label>
            <input id="f-max" name="max" type="number" min={0} inputMode="numeric" defaultValue={filters.max} className="field-input" />
          </div>
        </div>

        <div>
          <label htmlFor="f-sort" className="field-label">
            Sort
          </label>
          <select id="f-sort" name="sort" defaultValue={filters.sort} className="field-input">
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-4 sm:col-span-2 lg:col-span-6">
          <button type="submit" className="btn-primary">
            Apply
            <span className="btn-icon">↗</span>
          </button>
          {active ? (
            <a href={action} className="btn-ghost">
              Clear all
            </a>
          ) : null}
        </div>
      </div>
    </form>
  )
}
