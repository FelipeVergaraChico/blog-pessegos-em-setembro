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
            <Link
              key={post._id}
              href={`/posts/${post.slug}`}
              className="font-serif text-2xl leading-none text-coffee transition hover:text-wine dark:text-paper dark:hover:text-peach"
            >
              {post.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="rounded-card border border-beige/70 p-5 dark:border-paper/10">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Categorias</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categorias/${category.slug}`}
              className="rounded-full border border-beige px-3 py-2 text-sm text-coffee/75 transition hover:border-peach hover:text-wine dark:border-paper/10 dark:text-paper/75 dark:hover:border-peach"
            >
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
