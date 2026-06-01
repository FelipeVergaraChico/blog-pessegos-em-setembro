import type {PortableTextBlock} from '@portabletext/types'

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
