import Link from 'next/link'

type Props = {
  basePath: string
  page: number
  totalPages: number
  /** Query params to keep on every link (filters etc.); `page` is set per link. */
  params?: URLSearchParams
}

const linkClass =
  'inline-flex items-center rounded-full bg-shell px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] ring-1 ring-ink/5 transition-all duration-500 ease-spring hover:bg-paper hover:shadow-float active:scale-[0.98]'

export function Pagination({ basePath, page, totalPages, params }: Props) {
  if (totalPages <= 1) return null

  const href = (p: number) => {
    const query = new URLSearchParams(params)
    query.delete('page')
    if (p > 1) query.set('page', String(p))
    const s = query.toString()
    return s ? `${basePath}?${s}` : basePath
  }

  const PageLink = ({ to, rel, children }: { to: number; rel: 'prev' | 'next'; children: React.ReactNode }) => {
    const disabled = to < 1 || to > totalPages
    if (disabled) {
      return (
        <span aria-disabled="true" className={`${linkClass} opacity-40`}>
          {children}
        </span>
      )
    }
    return (
      <Link href={href(to)} rel={rel} className={linkClass}>
        {children}
      </Link>
    )
  }

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
      <PageLink to={page - 1} rel="prev">
        Previous
      </PageLink>
      <span className="text-xs text-muted">
        {page} / {totalPages}
      </span>
      <PageLink to={page + 1} rel="next">
        Next
      </PageLink>
    </nav>
  )
}
