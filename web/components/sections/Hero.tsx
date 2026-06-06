export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="forge-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-foreground/70 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Rust-powered analysis
        </p>

        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-7xl md:text-8xl">
          Code, shaped
          <span className="block bg-gradient-to-r from-amber via-orange to-rose bg-clip-text text-transparent">
            on the anvil
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-foreground/70 sm:text-lg">
          An in-browser playground on the Monaco editor. Type code and a Rust
          backend tokenizes it live &mdash; metrics, diagnostics, and formatting.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#playground" className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-background shadow-xl shadow-accent/20 transition-shadow hover:shadow-accent/40">Open the playground</a>
          <a href="#about" className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/60">How it works</a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-foreground/40">
        Scroll
      </div>
    </section>
  );
}
