import {PostCard} from '@/src/components/post-card'
import {sanityFetch} from '@/src/sanity/client'
import {cacheTags, searchPostsQuery} from '@/src/sanity/queries'
import type {Post} from '@/src/sanity/types'

type SearchPageProps = {
  searchParams: Promise<{q?: string}>
}

export default async function SearchPage({searchParams}: SearchPageProps) {
  const {q} = await searchParams
  const term = q?.trim()
  const posts = term
    ? await sanityFetch<Post[]>({
        query: searchPostsQuery,
        params: {term: `${term}*`},
        tags: [cacheTags.post, cacheTags.category],
        fallback: [],
      })
    : []

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Busca</p>
        <h1 className="mt-3 font-serif text-6xl leading-none text-coffee dark:text-paper">Encontrar textos</h1>
        <p className="mt-4 text-lg leading-8 text-coffee/70 dark:text-paper/70">
          Procure por titulo, resumo ou categoria.
        </p>
      </div>

      <form action="/busca" className="flex max-w-2xl gap-3">
        <input
          name="q"
          defaultValue={term}
          placeholder="literatura, cinema, cronicas..."
          className="min-w-0 flex-1 rounded-full border border-beige bg-cream px-5 py-3 text-coffee outline-none transition focus:border-peach dark:border-paper/10 dark:bg-surface dark:text-paper"
        />
        <button type="submit" className="rounded-full bg-peach px-5 py-3 text-sm font-medium text-coffee">
          Buscar
        </button>
      </form>

      {!term ? (
        <div className="rounded-card border border-beige/70 p-8 dark:border-paper/10">
          <h2 className="font-serif text-4xl leading-none text-coffee dark:text-paper">Digite uma palavra para comecar.</h2>
          <p className="mt-3 text-coffee/70 dark:text-paper/70">
            A busca do MVP prioriza titulo, resumo e categoria.
          </p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-beige/70 p-8 dark:border-paper/10">
          <h2 className="font-serif text-4xl leading-none text-coffee dark:text-paper">Nenhum resultado encontrado.</h2>
          <p className="mt-3 text-coffee/70 dark:text-paper/70">Tente buscar por outra palavra ou categoria.</p>
        </div>
      )}
    </section>
  )
}
