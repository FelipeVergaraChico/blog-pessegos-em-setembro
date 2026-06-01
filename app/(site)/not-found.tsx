import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
      <div className="grid gap-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Pagina nao encontrada</p>
        <h1 className="font-serif text-5xl leading-none text-coffee dark:text-paper">
          Esta pagina ficou em outro setembro.
        </h1>
        <p className="text-coffee/70 dark:text-paper/70">O texto que voce procurou nao esta disponivel.</p>
        <Link href="/" className="mx-auto inline-flex rounded-full bg-peach px-5 py-3 text-sm font-medium text-coffee">
          Voltar para a home
        </Link>
      </div>
    </section>
  )
}
