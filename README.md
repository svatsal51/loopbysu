# Loop by Su

A free, SEO/AEO/GEO-optimized CMS website built on Next.js 15 + Payload CMS 3, deployable entirely on free tiers ($0 total cost).

## Stack

- **Next.js 15** (App Router, TypeScript, Server Components)
- **Payload CMS 3** embedded in Next.js — auto-generated admin at `/admin`
- **Neon** Postgres (free tier)
- **Vercel Blob** for media storage (free tier)
- **Resend** for transactional email (free 3,000/mo)
- **Tailwind CSS** — soft editorial design system (warm cream/espresso, Fraunces display + Jost body, double-bezel cards, pill buttons, floating nav)
- **Vitest** unit tests, **ESLint** (`next lint`)
- **zod** for validation

## Local Development

```bash
npm install
cp .env.example .env
# fill in .env — see "Free-tier setup order" below
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin` for the CMS.

### Seed demo content

Once your database is connected and migrated (Payload auto-migrates on first boot in dev):

```bash
npm run seed
```

This creates an admin user (`admin@loopbysu.com` / `ChangeMe123!` — **change this immediately**), site settings, three demo collections (Bracelets, Necklaces, Earrings), eight collection items, three blog posts, and Home/About pages with full block content.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Payload auto-pushes schema changes to `DATABASE_URI`) |
| `npm run build` | Production build (needs a DB whose schema is up to date) |
| `npm test` | Unit tests (search filters, rate limit, validators, email templates) |
| `npm run lint` | ESLint via `next lint` |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `npm run seed` | Idempotent demo content; backfills price/material/tags on existing items |

## Search & filters

`/search` and `/collections/[slug]` share one URL-driven filter bar (`q`, `material`, `tag`, `min`, `max`, `sort`, `page`; `/search` adds `collection`). Query building lives in `src/lib/search.ts`. Items have `price` (INR, shown as "From ₹X"), `material` and `tags` fields. The site is enquiry-only: there is no cart or checkout.

## Newsletter

The footer form saves to the read-only `newsletter-subscribers` collection and sends a welcome email via Resend. It uses the same honeypot and rate limit as the other forms; re-subscribing is a silent success.

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | Neon Postgres connection string |
| `PAYLOAD_SECRET` | Long random string, used to sign Payload sessions |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for media uploads |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used in metadata, sitemap, JSON-LD |

## Free-Tier Setup Order

1. **Neon** — [neon.tech](https://neon.tech) → create a project/database → copy the pooled connection string into `DATABASE_URI`.
2. **Resend** — [resend.com](https://resend.com) → verify a sending domain (or use the sandbox `onboarding@resend.dev` sender for testing) → copy the API key into `RESEND_API_KEY`.
3. **Vercel Blob** — in your Vercel project → Storage → create a Blob store → copy the read/write token into `BLOB_READ_WRITE_TOKEN`.
4. **Vercel** — import this repo → paste all env vars from `.env.example` → deploy.
5. Visit `https://your-domain/admin` → create your first admin user (or run `npm run seed` locally against the same `DATABASE_URI` before deploying) → add content.

## Project Structure

```
src/
  app/
    (frontend)/       Public site (layout, routes, globals.css)
    (payload)/         Payload's admin + API route handlers
    sitemap.ts          Dynamic sitemap (pages, collections, items, posts)
    robots.ts            Allows all + AI crawlers, blocks /admin & /api
    llms.txt/route.ts     GEO summary for LLM crawlers
    llms-full.txt/route.ts Expanded content index
  collections/          Payload collection configs
  globals/              SiteSettings, SeoDefaults
  blocks/                Page-builder blocks (Hero, TextBlock, ImageBlock, FeatureGrid, CTA, FAQ, ProcessSteps)
  components/            Shared UI, block renderers, JSON-LD, forms
  lib/                    Payload client, SEO helpers, schema.org builders, email, rate limiting
  seed/                   Demo content seed script
  payload.config.ts        Payload CMS configuration
```

## Images

Every image slot renders through `components/MediaImage.tsx`: a `next/image` of the uploaded Media doc (preferring the generated `card`/`og` size) when one is attached, otherwise a deterministic CSS gradient (`GradientTile`). Upload photography in `/admin` and attach it to the collection, item, post, or block — no code change needed.

### Nanobanana prompts (for generating real product photography later)

Use these with Nanobanana (or any image model) to replace the gradient placeholders:

- **Hero (home)**: "Editorial studio product photo of handcrafted jewellery laid on white marble, soft directional light, black and white high-contrast mood, minimal shadows, 4:5 aspect ratio."
- **Collection tile — Bracelets**: "Close-up macro shot of a beaded bracelet on a bare wrist, monochrome studio lighting, shallow depth of field, editorial fashion photography."
- **Collection tile — Necklaces**: "Layered necklaces displayed on a matte black jewellery bust, high-key black and white lighting, minimalist background."
- **Collection tile — Earrings**: "Pair of handcrafted earrings on a white paper backdrop, top-down flat lay, soft studio shadows, monochrome."
- **Collection item gallery**: "Product photo of [item name], 3 angles — front, detail macro, worn on model — white seamless background, black and white editorial retouch."
- **Artisan story**: "Candid documentary photo of an artisan's hands assembling a beaded bracelet at a wooden studio bench, natural window light, black and white film grain."
- **Behind the scenes — Sketch**: "Overhead photo of a hand-drawn jewellery design sketch on kraft paper next to loose beads and a pencil, monochrome, soft natural light."
- **Behind the scenes — Source**: "Flat lay of raw jewellery-making materials — beads, chain, findings — organized in small trays, black and white studio photo."
- **Behind the scenes — Assemble**: "Close-up of hands stringing beads onto wire at a workbench, shallow depth of field, monochrome documentary style."
- **Behind the scenes — Pack & Ship**: "Overhead photo of a finished jewellery piece being wrapped in tissue paper inside a kraft box, minimal styling, black and white."
- **Blog cover images**: "Editorial lifestyle photo related to [post topic], black and white, minimal composition, generous negative space for text overlay."
- **Default OG image**: "Wide 1200x630 studio photo of an assortment of handcrafted jewellery arranged on white marble, black and white, centered composition with clear negative space."

## SEO / AEO / GEO

- Per-route `generateMetadata` (title, description, canonical, OG, Twitter card) with `SeoDefaults` fallback.
- Dynamic `sitemap.ts` covering pages, collections, collection items, and published posts.
- `robots.ts` allows all crawlers (including GPTBot, PerplexityBot, ClaudeBot, Google-Extended) and blocks `/admin` + `/api`.
- JSON-LD: `Organization` + `WebSite` (global), `BlogPosting` (posts), `BreadcrumbList` + `CollectionPage` (collections/items), `ContactPage` (contact), `FAQPage` (About page FAQ block).
- `/llms.txt` and `/llms-full.txt` for AI/LLM crawler discovery.
- Semantic HTML5, one `<h1>`/page, breadcrumbs on all deep pages, `next/image`-ready alt text throughout.

## Forms

Both the contact form (`/contact`) and item enquiry form (`/collection-item/[slug]`) use React 19 Server Actions with:

- `zod` validation
- A hidden honeypot field (`company`) — bots that fill it get a silent fake-success response
- In-memory per-IP rate limiting (5 requests/minute) — swap for Upstash Redis if you scale past a single serverless instance
- Submission saved to `ContactSubmissions` via the Payload local API (no HTTP hop)
- Two Resend emails: an admin notification and a user auto-reply

`ContactSubmissions` is read/delete-only in `/admin` — entries can only be created through the public forms.

## Deploying

```bash
git init   # if not already a repo
git add .
git commit -m "Initial commit"
```

Push to GitHub, then import into Vercel, paste the env vars, and deploy. Payload will create its tables in Neon automatically on first boot.
