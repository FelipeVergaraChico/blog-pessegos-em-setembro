'use client'

export default function ErrorPage({reset}: {error: Error; reset: () => void}) {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-20 text-center">
      <div className="grid gap-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Erro temporario</p>
        <h1 className="font-serif text-5xl leading-none text-coffee dark:text-paper">Algo saiu do ritmo.</h1>
        <p className="text-coffee/70 dark:text-paper/70">Tente carregar a pagina novamente.</p>
        <button
          type="button"
          onClick={reset}
          className="mx-auto inline-flex rounded-full bg-peach px-5 py-3 text-sm font-medium text-coffee"
        >
          Tentar novamente
        </button>
      </div>
    </section>
  )
}
