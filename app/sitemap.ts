import type {MetadataRoute} from 'next'
import {sanityFetch} from '@/src/sanity/client'
import {allPostsQuery, cacheTags, categoriesQuery} from '@/src/sanity/queries'
import type {Category, Post} from '@/src/sanity/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pessegos-em-setembro.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    sanityFetch<Post[]>({query: allPostsQuery, tags: [cacheTags.post], fallback: []}),
    sanityFetch<Category[]>({query: categoriesQuery, tags: [cacheTags.category], fallback: []}),
  ])

  const staticRoutes: MetadataRoute.Sitemap = ['', '/posts', '/busca', '/sobre'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/categorias/${category.slug}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...postRoutes, ...categoryRoutes]
}
