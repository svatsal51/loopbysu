import { getPayload } from 'payload'
import config from '../payload.config'
import { paragraph } from './richText'

async function run() {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding Loop by Su…')

  // --- Admin user -----------------------------------------------------
  const { docs: existingUsers } = await payload.find({ collection: 'users', limit: 1 })
  if (!existingUsers.length) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@loopbysu.com',
        password: 'ChangeMe123!',
        name: 'Studio Admin',
      },
    })
    payload.logger.info('Created admin user admin@loopbysu.com / ChangeMe123! — change this immediately.')
  }

  // --- Globals ----------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Loop by Su',
      tagline: 'Handcrafted jewellery, made to order.',
      contactRecipientEmail: 'admin@loopbysu.com',
      organizationName: 'Loop by Su',
      address: 'Ahmedabad, Gujarat, India',
      foundingYear: 2021,
      socials: {
        instagram: 'https://instagram.com/loopbysu',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'seo-defaults',
    data: {
      defaultMetaTitleTemplate: '%s | Loop by Su',
      defaultMetaDescription: 'Handcrafted, made-to-order jewellery — bracelets, necklaces, and earrings designed and finished by hand.',
      twitterHandle: '@loopbysu',
    },
  })

  // --- Collections --------------------------------------------------
  const collectionSeeds = [
    { name: 'Bracelets', description: 'Beaded and chain bracelets, made to order.', order: 1 },
    { name: 'Necklaces', description: 'Layered and statement necklaces.', order: 2 },
    { name: 'Earrings', description: 'Studs, hoops, and drops.', order: 3 },
  ]

  const collectionIds: Record<string, number> = {}
  for (const seed of collectionSeeds) {
    const { docs } = await payload.find({ collection: 'collections', where: { name: { equals: seed.name } }, limit: 1 })
    const doc =
      docs[0] ||
      (await payload.create({
        collection: 'collections',
        data: { name: seed.name, description: seed.description, order: seed.order, active: true },
      }))
    collectionIds[seed.name] = doc.id
  }

  // --- Collection Items -----------------------------------------------
  const itemSeeds: {
    title: string
    collection: string
    daysAgo: number
    price: number
    material: 'Beads' | 'Silver' | 'Gold-plated' | 'Brass' | 'Thread' | 'Pearl' | 'Stone' | 'Other'
    tags: string[]
  }[] = [
    { title: 'Sunstone Beaded Bracelet', collection: 'Bracelets', daysAgo: 1, price: 1499, material: 'Stone', tags: ['beaded', 'gift'] },
    { title: 'Minimal Chain Bracelet', collection: 'Bracelets', daysAgo: 4, price: 1199, material: 'Silver', tags: ['minimal', 'everyday'] },
    { title: 'Moonlight Layered Necklace', collection: 'Necklaces', daysAgo: 2, price: 2499, material: 'Gold-plated', tags: ['layered', 'gift'] },
    { title: 'Everyday Pendant Necklace', collection: 'Necklaces', daysAgo: 6, price: 1799, material: 'Silver', tags: ['minimal', 'everyday'] },
    { title: 'Brass Hoop Earrings', collection: 'Earrings', daysAgo: 0, price: 899, material: 'Brass', tags: ['everyday', 'statement'] },
    { title: 'Pearl Drop Earrings', collection: 'Earrings', daysAgo: 3, price: 1599, material: 'Pearl', tags: ['gift', 'elegant'] },
    { title: 'Woven Cord Bracelet', collection: 'Bracelets', daysAgo: 8, price: 699, material: 'Thread', tags: ['woven', 'everyday'] },
    { title: 'Statement Collar Necklace', collection: 'Necklaces', daysAgo: 10, price: 3299, material: 'Brass', tags: ['statement', 'elegant'] },
  ]

  for (const seed of itemSeeds) {
    const slug = seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const { docs } = await payload.find({ collection: 'collection-items', where: { slug: { equals: slug } }, limit: 1 })
    if (docs.length) {
      // Backfill the filter fields on items seeded before they existed.
      if (docs[0].price == null) {
        await payload.update({
          collection: 'collection-items',
          id: docs[0].id,
          data: { price: seed.price, material: seed.material, tags: seed.tags },
        })
      }
      continue
    }
    const date = new Date(Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000).toISOString()
    await payload.create({
      collection: 'collection-items',
      data: {
        title: seed.title,
        slug,
        collection: collectionIds[seed.collection],
        description: `${seed.title} — handcrafted in small batches, finished by hand.`,
        body: paragraph(`Every piece in the ${seed.collection} line starts as a sketch on the studio bench. ${seed.title} is finished, polished, and packed by hand before it reaches you.`),
        price: seed.price,
        material: seed.material,
        tags: seed.tags,
        date,
      },
    })
  }

  // --- Posts ------------------------------------------------------------
  const { docs: adminUsers } = await payload.find({ collection: 'users', limit: 1 })
  const authorId = adminUsers[0]?.id

  const postSeeds = [
    {
      title: 'How We Source Our Beads',
      excerpt: 'A look at the small suppliers behind every strand of colour on the bench.',
      daysAgo: 2,
    },
    {
      title: 'Caring for Handmade Jewellery',
      excerpt: 'Simple habits that keep beaded and chain pieces looking new for years.',
      daysAgo: 9,
    },
    {
      title: 'Behind the Design: Moonlight Necklace',
      excerpt: 'The story and sketches behind our most-loved layered necklace.',
      daysAgo: 16,
    },
  ]

  for (const seed of postSeeds) {
    const slug = seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const { docs } = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })
    if (docs.length) continue
    await payload.create({
      collection: 'posts',
      data: {
        title: seed.title,
        slug,
        excerpt: seed.excerpt,
        body: paragraph(`${seed.excerpt} Read on for the full story from the Loop by Su studio.`),
        author: authorId,
        publishedAt: new Date(Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
      },
    })
  }

  // --- Pages: Home ------------------------------------------------------
  const { docs: homeDocs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
  if (!homeDocs.length) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout: [
          {
            blockType: 'hero',
            eyebrow: 'Handcrafted in small batches',
            heading: 'Jewellery made slowly, worn every day.',
            subheading: 'Loop by Su designs and finishes every piece by hand — bracelets, necklaces, and earrings built to last.',
            ctaLabel: 'Shop Collections',
            ctaHref: '/collections',
          },
          {
            blockType: 'textBlock',
            heading: 'The Artisan Story',
            richText: paragraph(
              'Loop by Su started on a kitchen table in 2021 with a single strand of beads and a promise: every piece would be made by hand, start to finish. That promise still holds — each bracelet, necklace, and pair of earrings passes through the same hands, from sketch to shipping box.',
            ),
          },
          {
            blockType: 'processSteps',
            heading: 'Behind the Scenes',
            subheading: 'From sketch to finished piece — how every order comes together.',
            steps: [
              { title: 'Sketch', description: 'Every design starts as a hand-drawn sketch on the studio bench.' },
              { title: 'Source', description: 'Beads, chain, and findings are sourced from small, trusted suppliers.' },
              { title: 'Assemble', description: 'Each piece is strung, wired, and finished entirely by hand.' },
              { title: 'Pack & Ship', description: 'Finished pieces are inspected, packed, and shipped with care.' },
            ],
          },
          {
            blockType: 'cta',
            heading: 'Have something in mind?',
            subheading: 'We take custom orders — tell us what you\'re picturing.',
            buttonLabel: 'Get in Touch',
            buttonHref: '/contact',
          },
        ],
        meta: {
          title: 'Handcrafted Jewellery',
          description: 'Loop by Su designs and hand-finishes bracelets, necklaces, and earrings in small batches.',
        },
      },
    })
  }

  // --- Pages: About -------------------------------------------------
  const { docs: aboutDocs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'about' } }, limit: 1 })
  if (!aboutDocs.length) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'About',
        slug: 'about',
        layout: [
          {
            blockType: 'hero',
            eyebrow: 'About',
            heading: 'A small studio, made by hand.',
            subheading: 'Loop by Su is a one-person jewellery studio focused on slow, deliberate craft.',
          },
          {
            blockType: 'textBlock',
            heading: 'Our Story',
            richText: paragraph(
              'What began as a hobby became a studio in 2021. Today, Loop by Su designs and hand-finishes every piece in small batches, prioritising quality and care over speed.',
            ),
          },
          {
            blockType: 'faq',
            heading: 'Frequently Asked Questions',
            items: [
              {
                question: 'Do you take custom orders?',
                answer: 'Yes — reach out via the contact page with your idea, budget, and timeline.',
              },
              {
                question: 'Where do you ship?',
                answer: 'We currently ship across India, with international shipping available on request.',
              },
              {
                question: 'How long does an order take?',
                answer: 'Made-to-order pieces typically ship within 5–10 business days.',
              },
            ],
          },
        ],
        meta: {
          title: 'About',
          description: 'The story behind Loop by Su — a small, handcrafted jewellery studio.',
        },
      },
    })
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
