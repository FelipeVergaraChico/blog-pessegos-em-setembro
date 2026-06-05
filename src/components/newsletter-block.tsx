export function NewsletterBlock({text}: {text?: string}) {
  return (
    <section className="rounded-card border border-beige/70 p-5 dark:border-paper/10">
      <p className="text-xs uppercase tracking-[0.18em] text-wine dark:text-peach">Carta mensal</p>
      <h2 className="mt-3 font-serif text-3xl leading-none text-coffee dark:text-paper">
        Uma newsletter esta a caminho.
      </h2>
      <p className="mt-3 text-sm leading-6 text-coffee/70 dark:text-paper/70">
        {text || 'Em breve, um espaco para receber textos e notas com calma.'}
      </p>
      <div className="mt-5 flex gap-2">
        <input
          disabled
          aria-label="Newsletter indisponivel"
          placeholder="seu@email.com"
          className="min-w-0 flex-1 rounded-full border border-beige bg-cream px-4 py-3 text-sm text-coffee/60 dark:border-paper/10 dark:bg-night dark:text-paper/60"
        />
        <button disabled className="rounded-full bg-peach px-4 py-3 text-sm font-medium text-coffee opacity-70">
          Em breve
        </button>
      </div>
    </section>
  )
}
