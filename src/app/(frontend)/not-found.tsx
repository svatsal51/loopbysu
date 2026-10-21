import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70dvh] flex-col items-center justify-center py-14 text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-4 text-[2.5rem] font-light leading-[1.02] tracking-tight md:text-[5.5rem]">
        Page not <span className="italic">found</span>
      </h1>
      <p className="mt-6 max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn-primary mt-12">
        Back to home
        <span className="btn-icon">↗</span>
      </Link>
    </div>
  )
}
