import {EditorialSidebar} from '@/src/components/editorial-sidebar'
import {FeaturedPost} from '@/src/components/featured-post'
import {NewsletterBlock} from '@/src/components/newsletter-block'
import {PostCard} from '@/src/components/post-card'
import {sanityFetch} from '@/src/sanity/client'
import {
  cacheTags,
  categoriesQuery,
  featuredPostQuery,
  recentPostsQuery,
  settingsQuery,
} from '@/src/sanity/queries'
import type {Category, Post, Settings} from '@/src/sanity/types'

export default async function Home() {
  const [featuredPost, recentPosts, categories, settings] = await Promise.all([
    sanityFetch<Post | null>({query: featuredPostQuery, tags: [cacheTags.post], fallback: null}),
    sanityFetch<Post[]>({query: recentPostsQuery, tags: [cacheTags.post], fallback: []}),
    sanityFetch<Category[]>({query: categoriesQuery, tags: [cacheTags.category], fallback: []}),
    sanityFetch<Settings | null>({query: settingsQuery, tags: [cacheTags.settings], fallback: null}),
  ])

  return (
    <div className="bg-cream text-coffee dark:bg-night dark:text-paper">
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <FeaturedPost post={featuredPost} />
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="grid gap-8">
          <div className="flex items-end justify-between gap-4 border-b border-beige/70 pb-4 dark:border-paper/10">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Ultimos textos</p>
              <h2 className="mt-2 font-serif text-4xl leading-none text-coffee dark:text-paper">Para ler devagar</h2>
            </div>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2">
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-beige/70 p-8 dark:border-paper/10">
              <h2 className="font-serif text-4xl leading-none text-coffee dark:text-paper">Nenhum texto publicado ainda.</h2>
              <p className="mt-3 max-w-xl text-coffee/70 dark:text-paper/70">
                Assim que um post for publicado no Sanity Studio, ele aparece nesta pagina.
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <EditorialSidebar posts={recentPosts} categories={categories} settings={settings} />
          {!settings ? <NewsletterBlock /> : null}
        </div>
      </section>
    </div>
  )
}
