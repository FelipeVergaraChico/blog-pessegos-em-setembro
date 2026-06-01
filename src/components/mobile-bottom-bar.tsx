'use client'

import Link from 'next/link'
import {BookOpenText, Home, Info, Search} from 'lucide-react'
import {usePathname} from 'next/navigation'

const items = [
  {href: '/', label: 'Inicio', icon: Home},
  {href: '/posts', label: 'Posts', icon: BookOpenText},
  {href: '/busca', label: 'Busca', icon: Search},
  {href: '/sobre', label: 'Sobre', icon: Info},
]

export function MobileBottomBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-beige/80 bg-cream/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-12px_30px_rgba(61,47,42,0.08)] backdrop-blur md:hidden dark:border-paper/10 dark:bg-night/95 dark:shadow-[0_-12px_30px_rgba(0,0,0,0.25)]"
      aria-label="Navegacao mobile"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`grid min-h-12 place-items-center gap-1 rounded-card px-2 py-1 text-[0.7rem] font-medium transition ${
                active
                  ? 'bg-peach/20 text-wine dark:bg-peach/15 dark:text-peach'
                  : 'text-coffee/65 hover:bg-peach/10 hover:text-wine dark:text-paper/65 dark:hover:bg-surface dark:hover:text-peach'
              }`}
            >
              <Icon aria-hidden className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
