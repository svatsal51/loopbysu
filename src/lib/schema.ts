import { siteUrl } from '@/lib/seo'

type SiteSettingsDoc = {
  siteName?: string | null
  organizationName?: string | null
  address?: string | null
  foundingYear?: number | null
  tagline?: string | null
  socials?: { twitter?: string | null; linkedin?: string | null; github?: string | null; instagram?: string | null } | null
}

export function organizationSchema(site: SiteSettingsDoc) {
  const sameAs = [site.socials?.twitter, site.socials?.linkedin, site.socials?.github, site.socials?.instagram].filter(
    Boolean,
  )
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.organizationName || site.siteName,
    url: siteUrl,
    foundingDate: site.foundingYear ? String(site.foundingYear) : undefined,
    address: site.address || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  }
}

export function websiteSchema(site: SiteSettingsDoc) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }
}

export function articleSchema(post: {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  updatedAt?: string
  authorName?: string
  siteName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: post.authorName ? { '@type': 'Person', name: post.authorName } : undefined,
    publisher: post.siteName ? { '@type': 'Organization', name: post.siteName } : undefined,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${siteUrl}/contact`,
  }
}

export function productSchema(item: {
  title: string
  description?: string | null
  slug: string
  price?: number | null
  material?: string | null
  imageUrl?: string
  brand?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    description: item.description || undefined,
    material: item.material || undefined,
    image: item.imageUrl,
    brand: item.brand ? { '@type': 'Brand', name: item.brand } : undefined,
    url: `${siteUrl}/collection-item/${item.slug}`,
    offers:
      item.price != null
        ? {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: item.price,
            availability: 'https://schema.org/MadeToOrder',
            url: `${siteUrl}/collection-item/${item.slug}`,
          }
        : undefined,
  }
}

export function collectionPageSchema(name: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${siteUrl}${url}`,
  }
}
