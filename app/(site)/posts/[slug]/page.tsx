import {notFound} from 'next/navigation'
import {ImageFrame} from '@/src/components/image-frame'
import {PortableContent} from '@/src/components/portable-content'
import {formatDate} from '@/src/lib/format-date'
import {readingTime} from '@/src/lib/read-time'
import {buildMetadata} from '@/src/lib/seo'
import {sanityFetch} from '@/src/sanity/client'
import {cacheTags, postBySlugQuery} from '@/src/sanity/queries'
import type {Post} from '@/src/sanity/types'

type PostPageProps = {
  params: Promise<{slug: string}>
}

export function portableTextToPlainText(blocks: unknown) {
  if (!Array.isArray(blocks)) {
    return ''
  }

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

export async function generateMetadata({params}: PostPageProps) {
  const {slug} = await params
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: {slug},
    tags: [cacheTags.post],
    fallback: null,
  })

  if (!post) {
    return buildMetadata({title: 'Texto nao encontrado'})
  }

  return buildMetadata({title: post.title, description: post.excerpt, seo: post.seo})
}

export default async function PostPage({params}: PostPageProps) {
  const {slug} = await params
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: {slug},
    tags: [cacheTags.post],
    fallback: null,
  })

  if (!post) {
    notFound()
  }

  const plainText = portableTextToPlainText(post.body)

  return (
    <article className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto grid max-w-3xl gap-5 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">
          {post.category?.title || 'Cronicas'}
        </p>
        <h1 className="font-serif text-6xl leading-[0.95] text-coffee dark:text-paper md:text-7xl">{post.title}</h1>
        {post.excerpt ? <p className="text-lg leading-8 text-coffee/70 dark:text-paper/70">{post.excerpt}</p> : null}
        <p className="text-sm text-coffee/55 dark:text-paper/55">
          {formatDate(post.publishedAt)} {plainText ? `- ${readingTime(plainText)}` : ''}
        </p>
      </header>
      <ImageFrame image={post.coverImage} alt={post.title} priority className="aspect-[16/9] w-full" />
      <PortableContent value={post.body} />
    </article>
  )
}
