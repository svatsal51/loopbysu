'use client'

import { useEffect, useRef } from 'react'

export function ScrollReveal({
  children,
  className = '',
  as: As = 'div',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
  /** Stagger index; each step adds 80ms. */
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Component = As as any
  return (
    <Component
      ref={ref}
      className={`fade-up ${className}`}
      style={delay ? ({ '--reveal-delay': `${Math.min(delay, 8) * 80}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Component>
  )
}
