import {PostCard} from '@/src/components/post-card'
import {sanityFetch} from '@/src/sanity/client'
import {allPostsQuery, cacheTags} from '@/src/sanity/queries'
import type {Post} from '@/src/sanity/types'

export default async function PostsPage() {
  const posts = await sanityFetch<Post[]>({query: allPostsQuery, tags: [cacheTags.post], fallback: []})

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Arquivo</p>
        <h1 className="mt-3 font-serif text-6xl leading-none text-coffee dark:text-paper">Todos os textos</h1>
        <p className="mt-4 text-lg leading-8 text-coffee/70 dark:text-paper/70">
          Cultura, cotidiano, literatura e cronicas reunidas em um arquivo para leitura calma.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-beige/70 p-8 dark:border-paper/10">
          <h2 className="font-serif text-4xl leading-none text-coffee dark:text-paper">O arquivo ainda esta vazio.</h2>
          <p className="mt-3 text-coffee/70 dark:text-paper/70">Publique o primeiro post no Sanity para iniciar a colecao.</p>
        </div>
      )}
    </section>
  )
}
