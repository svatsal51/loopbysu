'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/collections', label: 'Collections' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
]

export function Nav({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4 md:top-6">
        <nav
          className="flex w-full max-w-4xl items-center justify-between rounded-full bg-paper/75 py-2 pl-6 pr-2 shadow-float ring-1 ring-ink/5 backdrop-blur-xl md:w-max md:gap-10"
          aria-label="Primary"
        >
          <Link href="/" className="font-display text-lg tracking-tight">
            {siteName}
          </Link>
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.slice(1).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-all duration-500 ease-spring hover:bg-ink/5 ${
                    isActive(link.href) ? 'bg-ink/5 text-ink' : 'text-ink/70'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 transition-transform duration-500 ease-spring active:scale-95 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-spring ${
                open ? 'rotate-45' : '-translate-y-[3px]'
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-spring ${
                open ? '-rotate-45' : 'translate-y-[3px]'
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-30 flex flex-col justify-center bg-paper/90 px-8 backdrop-blur-2xl transition-opacity duration-700 ease-spring md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="space-y-0">
          {LINKS.map((link, i) => (
            <li key={link.href} className="overflow-hidden">
              <Link
                href={link.href}
                tabIndex={open ? 0 : -1}
                style={{ transitionDelay: open ? `${100 + i * 50}ms` : '0ms' }}
                className={`block py-2 font-display text-3xl tracking-tight transition-all duration-700 ease-spring ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
