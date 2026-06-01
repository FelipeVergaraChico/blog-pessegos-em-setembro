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
