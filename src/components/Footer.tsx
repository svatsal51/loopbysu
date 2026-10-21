import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'

type Props = {
  siteName: string
  tagline?: string | null
  address?: string | null
  foundingYear?: number | null
  socials?: { twitter?: string | null; linkedin?: string | null; github?: string | null; instagram?: string | null } | null
}

const EXPLORE = [
  { href: '/collections', label: 'Collections' },
  { href: '/search', label: 'Search' },
  { href: '/blog', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Footer({ siteName, tagline, address, foundingYear, socials }: Props) {
  const socialLinks = [
    { key: 'instagram', href: socials?.instagram },
    { key: 'twitter', href: socials?.twitter },
    { key: 'linkedin', href: socials?.linkedin },
    { key: 'github', href: socials?.github },
  ].filter((s) => s.href)

  return (
    <footer className="container-x pb-6 pt-8 md:pt-12">
      <div className="bezel">
        <div className="bezel-core bg-shell px-6 py-10 md:px-14 md:py-16">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-7">
              <span className="eyebrow">Newsletter</span>
              <h2 className="mt-6 max-w-xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
                New pieces, quietly <span className="italic">delivered</span>.
              </h2>
              <div className="mt-10">
                <NewsletterForm />
              </div>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 md:col-span-5 md:pt-4">
              <div>
                <p className="field-label">Explore</p>
                <ul className="space-y-3 text-sm">
                  {EXPLORE.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-ink/80 hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="field-label">Studio</p>
                <div className="space-y-3 text-sm text-muted">
                  {address ? <p>{address}</p> : null}
                  {foundingYear ? <p>Est. {foundingYear}</p> : null}
                  {socialLinks.length ? (
                    <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
                      {socialLinks.map((s) => (
                        <li key={s.key}>
                          <a
                            href={s.href as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] uppercase tracking-widest2 text-ink/70 hover:text-ink"
                          >
                            {s.key}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-ink/10 pt-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-2xl tracking-tight">{siteName}</p>
              {tagline ? <p className="mt-2 max-w-xs text-sm text-muted">{tagline}</p> : null}
            </div>
            <p className="text-[10px] uppercase tracking-widest2 text-muted">
              &copy; {new Date().getFullYear()} {siteName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
