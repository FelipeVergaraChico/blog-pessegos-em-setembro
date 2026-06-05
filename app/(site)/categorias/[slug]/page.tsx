import {notFound} from 'next/navigation'
import {PostCard} from '@/src/components/post-card'
import {buildMetadata} from '@/src/lib/seo'
import {sanityFetch} from '@/src/sanity/client'
import {cacheTags, categoryBySlugQuery, postsByCategoryQuery} from '@/src/sanity/queries'
import type {Category, Post} from '@/src/sanity/types'

type CategoryPageProps = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: CategoryPageProps) {
  const {slug} = await params
  const category = await sanityFetch<Category | null>({
    query: categoryBySlugQuery,
    params: {slug},
    tags: [cacheTags.category],
    fallback: null,
  })

  return buildMetadata({
    title: category?.title || 'Categoria',
    description: category?.description,
  })
}

export default async function CategoryPage({params}: CategoryPageProps) {
  const {slug} = await params
  const [category, posts] = await Promise.all([
    sanityFetch<Category | null>({
      query: categoryBySlugQuery,
      params: {slug},
      tags: [cacheTags.category],
      fallback: null,
    }),
    sanityFetch<Post[]>({
      query: postsByCategoryQuery,
      params: {slug},
      tags: [cacheTags.post, cacheTags.category],
      fallback: [],
    }),
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="bg-cream text-coffee dark:bg-night dark:text-paper">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Categoria</p>
          <h1 className="mt-3 font-serif text-6xl leading-none text-coffee dark:text-paper">{category.title}</h1>
          {category.description ? (
            <p className="mt-4 text-lg leading-8 text-coffee/70 dark:text-paper/70">{category.description}</p>
          ) : null}
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-beige/70 p-8 dark:border-paper/10">
            <h2 className="font-serif text-4xl leading-none text-coffee dark:text-paper">Nada publicado aqui ainda.</h2>
            <p className="mt-3 text-coffee/70 dark:text-paper/70">
              Esta categoria esta pronta para receber novos textos.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
