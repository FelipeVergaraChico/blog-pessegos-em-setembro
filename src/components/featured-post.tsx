import Link from 'next/link'
import {formatDate} from '@/src/lib/format-date'
import type {Post} from '@/src/sanity/types'
import {ImageFrame} from './image-frame'

export function FeaturedPost({post}: {post?: Post | null}) {
  if (!post) {
    return (
      <section className="grid gap-6 rounded-card border border-beige/70 p-6 dark:border-paper/10">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Artigo principal</p>
        <h1 className="font-serif text-5xl leading-none text-coffee dark:text-paper">
          Textos novos estao sendo preparados.
        </h1>
        <p className="max-w-xl text-coffee/70 dark:text-paper/70">
          Quando o primeiro post for publicado no Sanity, ele aparece aqui.
        </p>
      </section>
    )
  }

  return (
    <section className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
      <Link href={`/posts/${post.slug}`} className="block overflow-hidden rounded-card">
        <ImageFrame
          image={post.coverImage}
          alt={post.title}
          priority
          className="aspect-[16/11] w-full transition duration-500 hover:scale-[1.01]"
        />
      </Link>
      <div className="grid gap-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">
          {post.category?.title || 'Artigo principal'}
        </p>
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
