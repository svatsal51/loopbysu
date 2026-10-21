import type { Metadata } from 'next'
import { Fraunces, Jost } from 'next/font/google'
import React from 'react'
import { getPayload } from '@/lib/payload'
import { siteUrl } from '@/lib/seo'
import { organizationSchema, websiteSchema } from '@/lib/schema'
import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

const display = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const site = await payload.findGlobal({ slug: 'site-settings' })
  return {
    metadataBase: new URL(siteUrl),
    title: { default: site?.siteName || 'Loop by Su', template: `%s | ${site?.siteName || 'Loop by Su'}` },
    description: site?.tagline || undefined,
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload()
  const site = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <html lang="en" className={`${jost.variable} ${display.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd data={organizationSchema(site)} />
        <JsonLd data={websiteSchema(site)} />
      </head>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <Nav siteName={site?.siteName || 'Loop by Su'} />
        <main id="main" className="min-h-[100dvh] pt-24 md:pt-28">
          {children}
        </main>
        <Footer
          siteName={site?.siteName || 'Loop by Su'}
          tagline={site?.tagline}
          address={site?.address}
          foundingYear={site?.foundingYear}
          socials={site?.socials}
        />
      </body>
    </html>
  )
}
