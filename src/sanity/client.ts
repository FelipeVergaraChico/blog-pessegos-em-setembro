import {createClient, type QueryParams} from '@sanity/client'

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-31'
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const hasSanityConfig = Boolean(projectId && dataset)

export const client = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null

type SanityFetchOptions = {
  query: string
  params?: QueryParams
  tags: string[]
  fallback?: unknown
}

export async function sanityFetch<T>({query, params = {}, tags, fallback}: SanityFetchOptions): Promise<T> {
  if (!client) {
    return fallback as T
  }

  try {
    return await client.fetch<T>(query, params, {
      next: {
        tags,
      },
    })
  } catch (error) {
    console.error('Sanity fetch failed', error)
    return fallback as T
  }
}
