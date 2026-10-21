import Link from 'next/link'

export function Breadcrumbs({ items }: { items: { name: string; url: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-6">
      <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest2 text-muted">
        {items.map((item, i) => (
          <li key={item.url} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {i === items.length - 1 ? (
              <span className="text-ink" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.url} className="hover:text-ink">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
