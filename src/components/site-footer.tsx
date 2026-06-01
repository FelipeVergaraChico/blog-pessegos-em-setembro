import {sanityFetch} from '@/src/sanity/client'
import {cacheTags, settingsQuery} from '@/src/sanity/queries'
import type {Settings} from '@/src/sanity/types'
import {safeHref} from '@/src/lib/safe-url'

export async function SiteFooter() {
  const settings = await sanityFetch<Settings | null>({
    query: settingsQuery,
    tags: [cacheTags.settings],
    fallback: null,
  })
  const socialLinks =
    settings?.socialLinks
      ?.map((link) => ({...link, href: safeHref(link.href)}))
      .filter((link): link is {label: string; href: string} => Boolean(link.label && link.href)) || []

  return (
    <footer className="border-t border-beige/70 bg-cream dark:border-paper/10 dark:bg-night">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-28 pt-10 text-sm text-coffee/70 dark:text-paper/70 sm:px-6 md:py-10 lg:px-8">
        <p className="max-w-2xl font-serif text-2xl text-coffee dark:text-paper">
          {settings?.title || 'Pessegos em Setembro'}
        </p>
        <p className="max-w-2xl">
          {settings?.description ||
            'Um diario literario sobre cultura, cotidiano, afetos e pensamento escrito para ser lido devagar.'}
        </p>
        {socialLinks.length > 0 ? (
          <nav className="flex flex-wrap gap-3" aria-label="Redes sociais">
            {socialLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-beige px-4 py-2 text-sm text-coffee/75 transition hover:border-peach hover:text-wine dark:border-paper/10 dark:text-paper/75 dark:hover:border-peach dark:hover:text-peach"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  )
}
