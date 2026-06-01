import {PortableContent} from '@/src/components/portable-content'
import {sanityFetch} from '@/src/sanity/client'
import {aboutQuery, cacheTags, settingsQuery} from '@/src/sanity/queries'
import type {AboutPage, Settings} from '@/src/sanity/types'

export default async function AboutPageRoute() {
  const [about, settings] = await Promise.all([
    sanityFetch<AboutPage | null>({query: aboutQuery, tags: [cacheTags.about], fallback: null}),
    sanityFetch<Settings | null>({query: settingsQuery, tags: [cacheTags.settings], fallback: null}),
  ])

  return (
    <section className="mx-auto grid max-w-4xl gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="grid gap-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Sobre</p>
        <h1 className="font-serif text-6xl leading-none text-coffee dark:text-paper">
          {about?.title || 'Pessegos em Setembro'}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-coffee/70 dark:text-paper/70">
          {settings?.description ||
            'Um diario literario sobre cultura, cotidiano, afetos e pensamento escrito para ser lido devagar.'}
        </p>
      </header>

      {about?.body?.length ? (
        <PortableContent value={about.body} />
      ) : (
        <div className="rounded-card border border-beige/70 p-8 dark:border-paper/10">
          <p className="text-lg leading-8 text-coffee/75 dark:text-paper/75">
            Este espaco reunira textos sobre cultura, literatura, arte, opinioes, cotidiano, relacionamentos e
            memorias afetivas.
          </p>
        </div>
      )}
    </section>
  )
}
