import Link from 'next/link'
import {Search} from 'lucide-react'
import {ThemeToggle} from '@/src/components/theme-toggle'

const links = [
  {href: '/posts', label: 'Posts'},
  {href: '/categorias/literatura', label: 'Literatura'},
  {href: '/categorias/cronicas', label: 'Cronicas'},
  {href: '/sobre', label: 'Sobre'},
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-beige/70 bg-cream/90 backdrop-blur dark:border-paper/10 dark:bg-night/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-2xl text-coffee dark:text-paper">
          Pessegos em Setembro
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-coffee/75 dark:text-paper/75 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-wine dark:hover:text-peach">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/busca"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-beige/70 text-coffee transition hover:border-peach hover:text-wine dark:border-paper/15 dark:text-paper dark:hover:border-peach"
            aria-label="Buscar posts"
          >
            <Search aria-hidden className="h-4 w-4" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
