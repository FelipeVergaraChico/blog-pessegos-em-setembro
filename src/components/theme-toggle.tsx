'use client'

import {Moon, Sun} from 'lucide-react'
import {useEffect, useSyncExternalStore} from 'react'

const themeEvent = 'theme-change'

function getThemeSnapshot() {
  if (typeof window === 'undefined') {
    return false
  }

  const stored = window.localStorage.getItem('theme')

  if (stored) {
    return stored === 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function subscribeToTheme(callback: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  window.addEventListener('storage', callback)
  window.addEventListener(themeEvent, callback)
  media.addEventListener('change', callback)

  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(themeEvent, callback)
    media.removeEventListener('change', callback)
  }
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  function toggleTheme() {
    const next = !dark

    document.documentElement.classList.toggle('dark', next)
    window.localStorage.setItem('theme', next ? 'dark' : 'light')
    window.dispatchEvent(new Event(themeEvent))
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-beige/70 text-coffee transition hover:border-peach hover:text-wine dark:border-paper/15 dark:text-paper dark:hover:border-peach"
      aria-label="Alternar modo claro e escuro"
    >
      {dark ? <Sun aria-hidden className="h-4 w-4" /> : <Moon aria-hidden className="h-4 w-4" />}
    </button>
  )
}
