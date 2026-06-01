import Link from 'next/link'
import {formatDate} from '@/src/lib/format-date'
import type {Post} from '@/src/sanity/types'
import {ImageFrame} from './image-frame'

export function PostCard({post}: {post: Post}) {
  return (
    <article className="group grid gap-4">
      <Link href={`/posts/${post.slug}`} className="block overflow-hidden rounded-card">
        <ImageFrame
          image={post.coverImage}
          alt={post.title}
          className="aspect-[4/3] w-full transition duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="grid gap-2">
        <p className="text-xs uppercase tracking-[0.14em] text-wine dark:text-peach">
          {post.category?.title || 'Cronicas'}
        </p>
        <h2 className="font-serif text-3xl leading-none text-coffee dark:text-paper">
          <Link href={`/posts/${post.slug}`} className="transition hover:text-wine dark:hover:text-peach">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="line-clamp-3 text-sm leading-6 text-coffee/70 dark:text-paper/70">{post.excerpt}</p>
        ) : null}
        <p className="text-xs text-coffee/55 dark:text-paper/55">{formatDate(post.publishedAt)}</p>
      </div>
    </article>
  )
}
