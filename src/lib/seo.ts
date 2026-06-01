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
