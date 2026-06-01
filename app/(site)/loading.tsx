export default function Loading() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-8 w-48 rounded-full bg-beige/60 dark:bg-surface" />
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="aspect-[16/10] rounded-card bg-beige/70 dark:bg-surface" />
        <div className="grid content-center gap-4">
          <div className="h-5 w-24 rounded-full bg-beige/70 dark:bg-surface" />
          <div className="h-16 rounded-card bg-beige/70 dark:bg-surface" />
          <div className="h-20 rounded-card bg-beige/70 dark:bg-surface" />
        </div>
      </div>
    </section>
  )
}
