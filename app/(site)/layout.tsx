import type {Metadata} from 'next'
import {Cormorant_Garamond, Inter} from 'next/font/google'
import {SiteFooter} from '@/src/components/site-footer'
import {SiteHeader} from '@/src/components/site-header'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Pessegos em Setembro',
    template: '%s | Pessegos em Setembro',
  },
  description: 'Diario literario sobre cultura, cotidiano, afetos e pensamento.',
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
