# Pessegos em Setembro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public Next.js blog for Pessegos em Setembro with Sanity hosted content, editorial visual identity, ISR cache tags, and no in-repo CMS.

**Architecture:** The repository contains only the public Next.js App Router application. Sanity Studio is hosted outside this repo, and this app consumes published Sanity content through a typed `sanityFetch` wrapper that applies cache tags. A secure `/api/revalidate` route validates the Sanity webhook secret before calling `revalidateTag`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, next-sanity, @portabletext/react, @sanity/image-url, next/image, Vitest, React Testing Library.

---

## File Structure

- `package.json`: scripts and dependencies for Next.js, linting, build and tests.
- `next.config.ts`: Next image remote patterns for Sanity CDN.
- `tailwind.config.ts`: color tokens, fonts, typography and dark mode.
- `postcss.config.mjs`: Tailwind PostCSS setup.
- `tsconfig.json`: TypeScript config and `@/*` path alias.
- `.env.example`: Sanity env var documentation.
- `app/(site)/layout.tsx`: public site shell, fonts, metadata defaults, navbar and footer.
- `app/(site)/page.tsx`: editorial home page.
- `app/(site)/posts/page.tsx`: all posts listing.
- `app/(site)/posts/[slug]/page.tsx`: post detail and dynamic metadata.
- `app/(site)/categorias/[slug]/page.tsx`: category listing.
- `app/(site)/busca/page.tsx`: public search route.
- `app/(site)/sobre/page.tsx`: about page.
- `app/(site)/not-found.tsx`: branded not-found state.
- `app/(site)/error.tsx`: branded client error boundary.
- `app/(site)/loading.tsx`: branded loading state.
- `app/api/revalidate/route.ts`: Sanity webhook endpoint.
- `app/sitemap.ts`: generated sitemap.
- `app/robots.ts`: robots rules.
- `src/sanity/client.ts`: Sanity client and `sanityFetch` wrapper.
- `src/sanity/queries.ts`: GROQ queries and tag mapping.
- `src/sanity/image.ts`: Sanity image URL helpers.
- `src/sanity/types.ts`: TypeScript types matching the external Sanity contract.
- `src/lib/read-time.ts`: reading-time helper.
- `src/lib/format-date.ts`: localized date helper.
- `src/lib/seo.ts`: metadata helper functions.
- `src/lib/revalidate.ts`: pure tag selection logic for webhook payloads.
- `src/components/*`: focused UI components.
- `src/test/*`: Vitest setup and test utilities.

## Task 1: Scaffold Next.js App

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/(site)/layout.tsx`
- Create: `app/(site)/page.tsx`
- Create: `.env.example`

- [ ] **Step 1: Scaffold the project**

Run:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir false --import-alias "@/*"
```

Expected: Next.js creates an App Router project in the current directory. If it refuses because files already exist, keep `.gitignore`, `docs/`, `AGENTS.md`, `CLAUDE.md`, and `.claude/`, then manually create the files listed in this task.

- [ ] **Step 2: Install runtime and test dependencies**

Run:

```bash
npm install next-sanity @portabletext/react @sanity/image-url clsx lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Expected: dependencies are added to `package.json`.

- [ ] **Step 3: Update scripts in `package.json`**

Use these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Create `.env.example`**

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-31
SANITY_REVALIDATE_SECRET=
```

- [ ] **Step 5: Configure `next.config.ts` for Sanity images**

```ts
import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 6: Verify scaffold**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands pass with the default app.

- [ ] **Step 7: Commit scaffold**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts app .env.example
git commit -m "chore: scaffold Next.js blog app"
```

## Task 2: Visual System and Site Shell

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/(site)/layout.tsx`
- Create: `app/(site)/globals.css`
- Create: `src/components/site-header.tsx`
- Create: `src/components/site-footer.tsx`
- Create: `src/components/theme-toggle.tsx`
- Create: `src/components/search-link.tsx`

- [ ] **Step 1: Configure Tailwind tokens**

Set `darkMode` to `class` and add these tokens:

```ts
import type {Config} from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F2EC',
        coffee: '#3D2F2A',
        peach: '#E89A7D',
        wine: '#6B3E4A',
        sage: '#7A8B6F',
        beige: '#D7C8BC',
        terracotta: '#D87B58',
        night: '#1C1817',
        surface: '#2A2422',
        paper: '#F3ECE6',
        rosewine: '#B86A7A',
        nightsage: '#92A887',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '0.5rem',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Add global CSS**

`app/(site)/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  background: #f8f2ec;
  color: #3d2f2a;
}

.dark body {
  background: #1c1817;
  color: #f3ece6;
}

::selection {
  background: #e89a7d;
  color: #3d2f2a;
}
```

- [ ] **Step 3: Implement `ThemeToggle`**

`src/components/theme-toggle.tsx`:

```tsx
'use client'

import {Moon, Sun} from 'lucide-react'
import {useEffect, useState} from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const enabled = stored ? stored === 'dark' : prefersDark
    setDark(enabled)
    document.documentElement.classList.toggle('dark', enabled)
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    window.localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-beige/70 text-coffee transition hover:border-peach hover:text-wine dark:border-paper/15 dark:text-paper dark:hover:border-peach"
      aria-label="Alternar modo claro e escuro"
    >
      {dark ? <Sun aria-hidden className="h-4 w-4" /> : <Moon aria-hidden className="h-4 w-4" />}
    </button>
  )
}
```

- [ ] **Step 4: Implement shell components**

`src/components/site-header.tsx`:

```tsx
import Link from 'next/link'
import {Search} from 'lucide-react'
import {ThemeToggle} from '@/src/components/theme-toggle'

const links = [
  {href: '/posts', label: 'Posts'},
  {href: '/categorias/literatura', label: 'Literatura'},
  {href: '/categorias/cronicas', label: 'Cronicas'},
  {href: '/sobre', label: 'Sobre'},
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-beige/70 bg-cream/90 backdrop-blur dark:border-paper/10 dark:bg-night/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-2xl text-coffee dark:text-paper">
          Pessegos em Setembro
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-coffee/75 dark:text-paper/75 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-wine dark:hover:text-peach">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/busca"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-beige/70 text-coffee transition hover:border-peach hover:text-wine dark:border-paper/15 dark:text-paper dark:hover:border-peach"
            aria-label="Buscar posts"
          >
            <Search aria-hidden className="h-4 w-4" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

`src/components/site-footer.tsx`:

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-beige/70 bg-cream dark:border-paper/10 dark:bg-night">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-coffee/70 dark:text-paper/70 sm:px-6 lg:px-8">
        <p className="max-w-2xl font-serif text-2xl text-coffee dark:text-paper">Pessegos em Setembro</p>
        <p className="max-w-2xl">
          Um diario literario sobre cultura, cotidiano, afetos e pensamento escrito para ser lido devagar.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Update `app/(site)/layout.tsx`**

```tsx
import type {Metadata} from 'next'
import {Cormorant_Garamond, Inter} from 'next/font/google'
import './globals.css'
import {SiteFooter} from '@/src/components/site-footer'
import {SiteHeader} from '@/src/components/site-header'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Pessegos em Setembro',
    template: '%s | Pessegos em Setembro',
  },
  description: 'Diario literario sobre cultura, cotidiano, afetos e pensamento.',
}

export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Verify shell**

Run:

```bash
npm run lint
npm run build
```

Expected: build passes and header/footer render on the default page.

- [ ] **Step 7: Commit shell**

```bash
git add tailwind.config.ts app src/components
git commit -m "feat: add editorial site shell"
```

## Task 3: Sanity Types, Client, Queries and Helpers

**Files:**
- Create: `src/sanity/types.ts`
- Create: `src/sanity/client.ts`
- Create: `src/sanity/queries.ts`
- Create: `src/sanity/image.ts`
- Create: `src/lib/read-time.ts`
- Create: `src/lib/format-date.ts`
- Create: `src/lib/seo.ts`
- Create: `vitest.config.ts`
- Create: `src/lib/read-time.test.ts`
- Create: `src/lib/format-date.test.ts`

- [ ] **Step 1: Add Vitest config**

`vitest.config.ts`:

```ts
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
```

- [ ] **Step 2: Define Sanity types**

`src/sanity/types.ts`:

```ts
import type {PortableTextBlock} from 'next-sanity'

export type SanityImage = {
  asset?: {
    _ref?: string
    _id?: string
    url?: string
  }
  alt?: string
  hotspot?: unknown
  crop?: unknown
}

export type Category = {
  _id: string
  title: string
  slug: string
  description?: string
  color?: string
}

export type SeoFields = {
  title?: string
  description?: string
  image?: SanityImage
}

export type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  featured?: boolean
  coverImage?: SanityImage
  category?: Category
  body?: PortableTextBlock[]
  seo?: SeoFields
}

export type Settings = {
  title: string
  description: string
  socialLinks?: Array<{label: string; href: string}>
  newsletterText?: string
  quote?: string
  seo?: SeoFields
}

export type AboutPage = {
  title: string
  body?: PortableTextBlock[]
  seo?: SeoFields
}
```

- [ ] **Step 3: Implement typed Sanity client and `sanityFetch` wrapper**

`src/sanity/client.ts`:

```ts
import {createClient, type QueryParams} from 'next-sanity'

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-31'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

type SanityFetchOptions = {
  query: string
  params?: QueryParams
  tags: string[]
}

export async function sanityFetch<T>({query, params = {}, tags}: SanityFetchOptions): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      tags,
    },
  })
}
```

- [ ] **Step 4: Centralize GROQ queries and cache tags**

`src/sanity/queries.ts`:

```ts
export const cacheTags = {
  post: 'post',
  category: 'category',
  settings: 'settings',
  about: 'about',
} as const

const postFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  "coverImage": mainImage{
    asset,
    alt,
    hotspot,
    crop
  },
  "category": category->{
    _id,
    title,
    "slug": slug.current,
    description,
    color
  },
  seo
`

export const featuredPostQuery = `*[_type == "post" && defined(slug.current) && featured == true] | order(publishedAt desc)[0] {${postFields}, body}`
export const recentPostsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...9] {${postFields}}`
export const allPostsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {${postFields}}`
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {${postFields}, body}`
export const postsByCategoryQuery = `*[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) {${postFields}}`
export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {_id, title, "slug": slug.current, description, color}`
export const categoriesQuery = `*[_type == "category"] | order(title asc) {_id, title, "slug": slug.current, description, color}`
export const settingsQuery = `*[_type == "settings"][0] {title, description, socialLinks, newsletterText, quote, seo}`
export const aboutQuery = `*[_type == "about"][0] {title, body, seo}`
export const searchPostsQuery = `*[
  _type == "post" &&
  defined(slug.current) &&
  (
    title match $term ||
    excerpt match $term ||
    category->title match $term
  )
] | order(publishedAt desc) {${postFields}}`
```

- [ ] **Step 5: Add image helper**

`src/sanity/image.ts`:

```ts
import imageUrlBuilder from '@sanity/image-url'
import {client} from '@/src/sanity/client'
import type {SanityImage} from '@/src/sanity/types'

const builder = imageUrlBuilder(client)

export function urlForImage(source?: SanityImage) {
  if (!source?.asset) {
    return null
  }

  return builder.image(source).auto('format').fit('max')
}
```

- [ ] **Step 6: Write helper tests**

`src/lib/read-time.test.ts`:

```ts
import {describe, expect, it} from 'vitest'
import {readingTime} from './read-time'

describe('readingTime', () => {
  it('returns at least one minute for short text', () => {
    expect(readingTime('texto curto')).toBe('1 min de leitura')
  })

  it('rounds longer text by 220 words per minute', () => {
    const text = Array.from({length: 440}, () => 'palavra').join(' ')
    expect(readingTime(text)).toBe('2 min de leitura')
  })
})
```

`src/lib/format-date.test.ts`:

```ts
import {describe, expect, it} from 'vitest'
import {formatDate} from './format-date'

describe('formatDate', () => {
  it('formats dates in Brazilian Portuguese', () => {
    expect(formatDate('2026-05-31T12:00:00.000Z')).toContain('2026')
  })
})
```

- [ ] **Step 7: Implement helpers**

`src/lib/read-time.ts`:

```ts
export function readingTime(input = '') {
  const words = input.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 220))
  return `${minutes} min de leitura`
}
```

`src/lib/format-date.ts`:

```ts
export function formatDate(value?: string) {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}
```

`src/lib/seo.ts`:

```ts
import type {Metadata} from 'next'
import type {SeoFields} from '@/src/sanity/types'

type SeoInput = {
  title: string
  description?: string
  seo?: SeoFields
}

export function buildMetadata({title, description, seo}: SeoInput): Metadata {
  const metadataTitle = seo?.title || title
  const metadataDescription = seo?.description || description || 'Pessegos em Setembro'

  return {
    title: metadataTitle,
    description: metadataDescription,
    openGraph: {
      title: metadataTitle,
      description: metadataDescription,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadataTitle,
      description: metadataDescription,
    },
  }
}
```

- [ ] **Step 8: Verify helpers**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected: tests, lint and build pass.

- [ ] **Step 9: Commit Sanity foundation**

```bash
git add src/sanity src/lib vitest.config.ts package.json package-lock.json
git commit -m "feat: add Sanity data foundation"
```

## Task 4: Revalidation Webhook

**Files:**
- Create: `src/lib/revalidate.ts`
- Create: `src/lib/revalidate.test.ts`
- Create: `app/api/revalidate/route.ts`

- [ ] **Step 1: Write tag selection tests**

`src/lib/revalidate.test.ts`:

```ts
import {describe, expect, it} from 'vitest'
import {tagsForWebhookPayload} from './revalidate'

describe('tagsForWebhookPayload', () => {
  it('maps post events to post, category and settings-sensitive pages', () => {
    expect(tagsForWebhookPayload({_type: 'post'})).toEqual(['post', 'category', 'settings'])
  })

  it('maps category events to category and post listings', () => {
    expect(tagsForWebhookPayload({_type: 'category'})).toEqual(['category', 'post'])
  })

  it('maps settings events to settings', () => {
    expect(tagsForWebhookPayload({_type: 'settings'})).toEqual(['settings'])
  })

  it('maps about events to about', () => {
    expect(tagsForWebhookPayload({_type: 'about'})).toEqual(['about'])
  })

  it('returns an empty list for unknown document types', () => {
    expect(tagsForWebhookPayload({_type: 'author'})).toEqual([])
  })
})
```

- [ ] **Step 2: Implement tag selection**

`src/lib/revalidate.ts`:

```ts
export type SanityWebhookPayload = {
  _type?: string
  _id?: string
  operation?: 'create' | 'update' | 'delete'
}

export function tagsForWebhookPayload(payload: SanityWebhookPayload) {
  switch (payload._type) {
    case 'post':
      return ['post', 'category', 'settings']
    case 'category':
      return ['category', 'post']
    case 'settings':
      return ['settings']
    case 'about':
      return ['about']
    default:
      return []
  }
}
```

- [ ] **Step 3: Implement `/api/revalidate`**

`app/api/revalidate/route.ts`:

```ts
import {revalidateTag} from 'next/cache'
import {NextRequest} from 'next/server'
import {tagsForWebhookPayload, type SanityWebhookPayload} from '@/src/lib/revalidate'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-sanity-revalidate-secret') || request.nextUrl.searchParams.get('secret')

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return Response.json({revalidated: false, message: 'Invalid secret'}, {status: 401})
  }

  const payload = (await request.json().catch(() => null)) as SanityWebhookPayload | null

  if (!payload?._type) {
    return Response.json({revalidated: false, message: 'Missing document type'}, {status: 400})
  }

  const tags = tagsForWebhookPayload(payload)

  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }

  return Response.json({
    revalidated: tags.length > 0,
    tags,
    type: payload._type,
  })
}
```

- [ ] **Step 4: Verify webhook logic**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected: tests pass and build compiles the route.

- [ ] **Step 5: Commit webhook**

```bash
git add app/api/revalidate src/lib/revalidate.ts src/lib/revalidate.test.ts
git commit -m "feat: add Sanity revalidation webhook"
```

## Task 5: Editorial Components

**Files:**
- Create: `src/components/post-card.tsx`
- Create: `src/components/featured-post.tsx`
- Create: `src/components/editorial-sidebar.tsx`
- Create: `src/components/newsletter-block.tsx`
- Create: `src/components/portable-content.tsx`
- Create: `src/components/image-frame.tsx`

- [ ] **Step 1: Implement image frame with fallback**

`src/components/image-frame.tsx`:

```tsx
import Image from 'next/image'
import {urlForImage} from '@/src/sanity/image'
import type {SanityImage} from '@/src/sanity/types'

type ImageFrameProps = {
  image?: SanityImage
  alt?: string
  priority?: boolean
  className?: string
}

export function ImageFrame({image, alt = '', priority = false, className = ''}: ImageFrameProps) {
  const url = urlForImage(image)

  if (!url) {
    return <div className={`rounded-card bg-peach/30 ${className}`} aria-hidden />
  }

  return (
    <Image
      src={url.width(1400).height(900).url()}
      alt={image?.alt || alt}
      width={1400}
      height={900}
      priority={priority}
      className={`rounded-card object-cover ${className}`}
    />
  )
}
```

- [ ] **Step 2: Implement post card**

`src/components/post-card.tsx`:

```tsx
import Link from 'next/link'
import {formatDate} from '@/src/lib/format-date'
import type {Post} from '@/src/sanity/types'
import {ImageFrame} from './image-frame'

export function PostCard({post}: {post: Post}) {
  return (
    <article className="group grid gap-4">
      <Link href={`/posts/${post.slug}`} className="block overflow-hidden rounded-card">
        <ImageFrame image={post.coverImage} alt={post.title} className="aspect-[4/3] w-full transition duration-500 group-hover:scale-[1.02]" />
      </Link>
      <div className="grid gap-2">
        <p className="text-xs uppercase tracking-[0.14em] text-wine dark:text-peach">{post.category?.title || 'Cronicas'}</p>
        <h2 className="font-serif text-3xl leading-none text-coffee dark:text-paper">
          <Link href={`/posts/${post.slug}`} className="transition hover:text-wine dark:hover:text-peach">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? <p className="line-clamp-3 text-sm leading-6 text-coffee/70 dark:text-paper/70">{post.excerpt}</p> : null}
        <p className="text-xs text-coffee/55 dark:text-paper/55">{formatDate(post.publishedAt)}</p>
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Implement featured post**

`src/components/featured-post.tsx`:

```tsx
import Link from 'next/link'
import {formatDate} from '@/src/lib/format-date'
import type {Post} from '@/src/sanity/types'
import {ImageFrame} from './image-frame'

export function FeaturedPost({post}: {post?: Post | null}) {
  if (!post) {
    return (
      <section className="grid gap-6 rounded-card border border-beige/70 p-6 dark:border-paper/10">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Artigo principal</p>
        <h1 className="font-serif text-5xl leading-none text-coffee dark:text-paper">Textos novos estao sendo preparados.</h1>
        <p className="max-w-xl text-coffee/70 dark:text-paper/70">Quando o primeiro post for publicado no Sanity, ele aparece aqui.</p>
      </section>
    )
  }

  return (
    <section className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
      <Link href={`/posts/${post.slug}`} className="block overflow-hidden rounded-card">
        <ImageFrame image={post.coverImage} alt={post.title} priority className="aspect-[16/11] w-full transition duration-500 hover:scale-[1.01]" />
      </Link>
      <div className="grid gap-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">{post.category?.title || 'Artigo principal'}</p>
        <h1 className="font-serif text-6xl leading-[0.92] text-coffee dark:text-paper md:text-7xl">
          <Link href={`/posts/${post.slug}`} className="transition hover:text-wine dark:hover:text-peach">
            {post.title}
          </Link>
        </h1>
        {post.excerpt ? <p className="text-lg leading-8 text-coffee/75 dark:text-paper/75">{post.excerpt}</p> : null}
        <p className="text-sm text-coffee/55 dark:text-paper/55">{formatDate(post.publishedAt)}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Implement sidebar and newsletter**

`src/components/newsletter-block.tsx`:

```tsx
export function NewsletterBlock({text}: {text?: string}) {
  return (
    <section className="rounded-card border border-beige/70 bg-peach/15 p-5 dark:border-paper/10 dark:bg-surface">
      <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Carta mensal</p>
      <h2 className="mt-3 font-serif text-3xl leading-none text-coffee dark:text-paper">Uma newsletter esta a caminho.</h2>
      <p className="mt-3 text-sm leading-6 text-coffee/70 dark:text-paper/70">
        {text || 'Em breve, um espaco para receber textos e notas com calma.'}
      </p>
      <div className="mt-5 flex gap-2">
        <input
          disabled
          aria-label="Newsletter indisponivel"
          placeholder="seu@email.com"
          className="min-w-0 flex-1 rounded-full border border-beige bg-cream px-4 py-3 text-sm text-coffee/60 dark:border-paper/10 dark:bg-night dark:text-paper/60"
        />
        <button disabled className="rounded-full bg-peach px-4 py-3 text-sm font-medium text-coffee opacity-70">
          Em breve
        </button>
      </div>
    </section>
  )
}
```

`src/components/editorial-sidebar.tsx`:

```tsx
import Link from 'next/link'
import type {Category, Post, Settings} from '@/src/sanity/types'
import {NewsletterBlock} from './newsletter-block'

type EditorialSidebarProps = {
  posts: Post[]
  categories: Category[]
  settings?: Settings | null
}

export function EditorialSidebar({posts, categories, settings}: EditorialSidebarProps) {
  return (
    <aside className="grid gap-6">
      <section className="rounded-card border border-beige/70 p-5 dark:border-paper/10">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Populares</p>
        <div className="mt-4 grid gap-4">
          {posts.slice(0, 4).map((post) => (
            <Link key={post._id} href={`/posts/${post.slug}`} className="font-serif text-2xl leading-none text-coffee transition hover:text-wine dark:text-paper dark:hover:text-peach">
              {post.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="rounded-card border border-beige/70 p-5 dark:border-paper/10">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Categorias</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category._id} href={`/categorias/${category.slug}`} className="rounded-full border border-beige px-3 py-2 text-sm text-coffee/75 transition hover:border-peach hover:text-wine dark:border-paper/10 dark:text-paper/75 dark:hover:border-peach">
              {category.title}
            </Link>
          ))}
        </div>
      </section>
      {settings?.quote ? (
        <blockquote className="rounded-card border border-beige/70 p-5 font-serif text-3xl leading-tight text-wine dark:border-paper/10 dark:text-peach">
          {settings.quote}
        </blockquote>
      ) : null}
      <NewsletterBlock text={settings?.newsletterText} />
    </aside>
  )
}
```

- [ ] **Step 5: Implement Portable Text renderer**

`src/components/portable-content.tsx`:

```tsx
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import {ImageFrame} from './image-frame'

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="mb-6 text-lg leading-8 text-coffee/80 dark:text-paper/80">{children}</p>,
    h2: ({children}) => <h2 className="mb-4 mt-10 font-serif text-4xl leading-none text-coffee dark:text-paper">{children}</h2>,
    h3: ({children}) => <h3 className="mb-3 mt-8 font-serif text-3xl leading-none text-coffee dark:text-paper">{children}</h3>,
    blockquote: ({children}) => <blockquote className="my-8 border-l-4 border-peach pl-5 font-serif text-3xl leading-tight text-wine dark:text-peach">{children}</blockquote>,
  },
  marks: {
    link: ({children, value}) => (
      <a href={value?.href} className="text-wine underline decoration-peach underline-offset-4 dark:text-peach">
        {children}
      </a>
    ),
  },
  types: {
    image: ({value}) => <ImageFrame image={value} className="my-8 aspect-[16/10] w-full" />,
  },
}

export function PortableContent({value}: {value?: PortableTextBlock[]}) {
  if (!value?.length) {
    return null
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PortableText value={value} components={components} />
    </div>
  )
}
```

- [ ] **Step 6: Verify components compile**

Run:

```bash
npm run lint
npm run build
```

Expected: build passes.

- [ ] **Step 7: Commit components**

```bash
git add src/components
git commit -m "feat: add editorial blog components"
```

## Task 6: Public Pages

**Files:**
- Modify: `app/(site)/page.tsx`
- Create: `app/(site)/posts/page.tsx`
- Create: `app/(site)/posts/[slug]/page.tsx`
- Create: `app/(site)/categorias/[slug]/page.tsx`
- Create: `app/(site)/busca/page.tsx`
- Create: `app/(site)/sobre/page.tsx`

- [ ] **Step 1: Implement home page data fetching**

Use `sanityFetch` only. Tags:

- featured/recent posts: `['post']`
- categories: `['category']`
- settings: `['settings']`

Home renders featured post, recent post cards, categories, newsletter visual block and sidebar.

- [ ] **Step 2: Implement `/posts`**

Fetch `allPostsQuery` with tag `['post']`. Render a responsive grid of `PostCard` components and a branded empty state when no posts exist.

- [ ] **Step 3: Implement `/posts/[slug]`**

Fetch `postBySlugQuery` with tag `['post']`. If no post is returned, call `notFound()`. Render cover, category, title, excerpt, date, reading time and `PortableContent`.

For reading time, derive plain text from Portable Text blocks with a local helper inside the page or a small utility:

```ts
function portableTextToPlainText(blocks: unknown[] = []) {
  return blocks
    .map((block) => {
      if (typeof block === 'object' && block && 'children' in block) {
        const children = (block as {children?: Array<{text?: string}>}).children || []
        return children.map((child) => child.text || '').join(' ')
      }
      return ''
    })
    .join(' ')
}
```

- [ ] **Step 4: Implement `/categorias/[slug]`**

Fetch `categoryBySlugQuery` with tag `['category']` and `postsByCategoryQuery` with tags `['post', 'category']`. If the category is missing, call `notFound()`.

- [ ] **Step 5: Implement `/busca`**

Read `searchParams.q`. If absent, show a calm search introduction. If present, run `searchPostsQuery` with `$term` equal to `${q}*`, tags `['post', 'category']`, and render matches prioritizing title, excerpt and category.

- [ ] **Step 6: Implement `/sobre`**

Fetch `aboutQuery` with tag `['about']` and `settingsQuery` with tag `['settings']`. Render Portable Text when available and fallback copy when Sanity has no about document.

- [ ] **Step 7: Verify pages**

Run:

```bash
npm run lint
npm run build
```

Expected: all routes compile. With missing Sanity env vars, either build uses empty fallbacks or fails with a clear env message; choose clear env message if the Sanity project is required before deploy.

- [ ] **Step 8: Commit pages**

```bash
git add app src
git commit -m "feat: add public blog pages"
```

## Task 7: SEO and App Router States

**Files:**
- Create: `app/(site)/not-found.tsx`
- Create: `app/(site)/error.tsx`
- Create: `app/(site)/loading.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Modify: `app/(site)/posts/[slug]/page.tsx`
- Modify: `app/(site)/categorias/[slug]/page.tsx`
- Modify: `app/(site)/sobre/page.tsx`

- [ ] **Step 1: Add not-found page**

`app/(site)/not-found.tsx`:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
      <div className="grid gap-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Pagina nao encontrada</p>
        <h1 className="font-serif text-5xl leading-none text-coffee dark:text-paper">Esta pagina ficou em outro setembro.</h1>
        <p className="text-coffee/70 dark:text-paper/70">O texto que voce procurou nao esta disponivel.</p>
        <Link href="/" className="mx-auto inline-flex rounded-full bg-peach px-5 py-3 text-sm font-medium text-coffee">
          Voltar para a home
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add error boundary**

`app/(site)/error.tsx`:

```tsx
'use client'

export default function ErrorPage({reset}: {error: Error; reset: () => void}) {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
      <div className="grid gap-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Erro temporario</p>
        <h1 className="font-serif text-5xl leading-none text-coffee dark:text-paper">Algo saiu do ritmo.</h1>
        <p className="text-coffee/70 dark:text-paper/70">Tente carregar a pagina novamente.</p>
        <button type="button" onClick={reset} className="mx-auto inline-flex rounded-full bg-peach px-5 py-3 text-sm font-medium text-coffee">
          Tentar novamente
        </button>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add loading state**

`app/(site)/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-8 w-48 rounded-full bg-beige/60 dark:bg-surface" />
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="aspect-[16/10] rounded-card bg-beige/70 dark:bg-surface" />
        <div className="grid content-center gap-4">
          <div className="h-5 w-24 rounded-full bg-beige/70 dark:bg-surface" />
          <div className="h-16 rounded-card bg-beige/70 dark:bg-surface" />
          <div className="h-20 rounded-card bg-beige/70 dark:bg-surface" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Add sitemap and robots**

`app/robots.ts`:

```ts
import type {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: '/sitemap.xml',
  }
}
```

`app/sitemap.ts` should include static routes first. Add dynamic post/category URLs after the public pages are stable and Sanity env vars are available.

- [ ] **Step 5: Add dynamic metadata**

Use `buildMetadata` in post, category and about pages. Post metadata uses `post.seo` first, then title/excerpt. About metadata uses `about.seo` first, then settings fallback.

- [ ] **Step 6: Verify SEO states**

Run:

```bash
npm run lint
npm run build
```

Expected: state routes compile and metadata functions do not throw on missing optional Sanity fields.

- [ ] **Step 7: Commit SEO and states**

```bash
git add app src/lib/seo.ts
git commit -m "feat: add SEO and app states"
```

## Task 8: Final Verification and Browser QA

**Files:**
- Modify: only the exact app, src, config or test files that fail verification in Steps 1-5.

- [ ] **Step 1: Run full automated verification**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected: all commands pass.

- [ ] **Step 2: Start local server**

Run:

```bash
npm run dev
```

Expected: local Next.js dev server starts. Use another port if `3000` is already occupied.

- [ ] **Step 3: Browser QA desktop**

Open the local URL and verify:

- home renders without overlap;
- header, search link and theme toggle are usable;
- light mode uses cream background and peach accents;
- dark mode uses night background and peach accents;
- cards and article body have stable spacing.

- [ ] **Step 4: Browser QA mobile**

Resize to a mobile viewport and verify:

- navigation does not overflow;
- sidebar content appears below main content;
- article text is comfortable to read;
- buttons and links remain tappable;
- no text overlaps cards or images.

- [ ] **Step 5: Verify webhook manually**

With `SANITY_REVALIDATE_SECRET=test-secret`, send an invalid and valid request:

```bash
curl -i -X POST "http://localhost:3000/api/revalidate" -H "Content-Type: application/json" -d "{\"_type\":\"post\"}"
curl -i -X POST "http://localhost:3000/api/revalidate?secret=test-secret" -H "Content-Type: application/json" -d "{\"_type\":\"post\",\"operation\":\"update\"}"
```

Expected: first request returns `401`; second request returns JSON with `revalidated: true` and tags containing `post`.

- [ ] **Step 6: Commit verification fixes**

If verification required code changes:

```bash
git add app src package.json package-lock.json next.config.ts tailwind.config.ts
git commit -m "fix: polish blog verification issues"
```

If no code changes were needed, do not create an empty commit.

## Self-Review Checklist

- Spec coverage: product scope, Sanity hosted, no in-repo Studio, env vars, `sanityFetch` tags, webhook validation, unpublish/delete handling, pages, visual direction, responsive behavior, SEO and states are covered.
- Placeholder scan: no `TBD`, `TODO`, or unspecified CMS work remains in this plan.
- Type consistency: `Post`, `Category`, `Settings`, `AboutPage`, `SanityImage`, `cacheTags`, `sanityFetch`, `tagsForWebhookPayload`, `readingTime`, `formatDate`, and `buildMetadata` are defined before use.
