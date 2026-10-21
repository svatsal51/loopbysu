import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { contactPageSchema } from '@/lib/schema'
import { ContactForm } from '@/components/ContactForm'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Contact',
    description: 'Get in touch — questions, custom orders, or press enquiries.',
    path: '/contact',
  })
}

export default async function ContactPage() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'collections',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 50,
  })

  return (
    <>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }]} />
      <div className="container-x section-pad grid gap-8 md:gap-12 md:grid-cols-12">
        <header className="md:col-span-5">
          <span className="eyebrow">Get in touch</span>
          <h1 className="mt-4 text-[2.5rem] font-light leading-[1.02] tracking-tight md:text-[4.5rem]">
            Let&apos;s <span className="italic">talk</span>
          </h1>
          <p className="mt-6 max-w-sm text-muted">
            Questions about a piece, custom orders, or press — send us a message and we&apos;ll reply directly to your inbox.
          </p>
        </header>
        <div className="bezel md:col-span-7">
          <div className="bezel-core p-6 md:p-10">
            <ContactForm typeOptions={docs.map((c: any) => ({ slug: c.slug, name: c.name }))} />
          </div>
        </div>
      </div>
      <JsonLd data={contactPageSchema()} />
    </>
  )
}
