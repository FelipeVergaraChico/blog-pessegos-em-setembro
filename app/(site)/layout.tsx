import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pessegos em Setembro',
  description: 'Blog editorial construido com Next.js e Sanity.',
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
