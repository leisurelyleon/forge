import { Reveal } from "@/components/motion/Reveal";

const features = [
  {
    title: "Pure-logic tokenizer",
    body: "A dependency-free C-family lexer produces tokens with positions for JavaScript, Rust, and JSON. No I/O in the core, so it is fully unit-testable.",
  },
  {
    title: "Analyze-on-type",
    body: "Keystrokes are debounced and sent to the backend; out-of-order responses are dropped with a monotonic request id so the readout never flickers backward.",
  },
  {
    title: "Real diagnostics",
    body: "Delimiter balance with mismatch and unclosed detection, unterminated strings and block comments, and TODO/FIXME markers, each with a line and column.",
  },
  {
    title: "Server-side formatter",
    body: "A conservative normalizer re-indents by net delimiter depth, ignoring brackets inside strings and comments and leaving multi-line literals untouched.",
  },
  {
    title: "Monaco editor",
    body: "The engine behind VS Code, integrated via a client-only dynamic import with the theme wired to the site's light and dark modes.",
  },
  {
    title: "Honest states",
    body: "Requests time out instead of hanging, and a clear banner appears when the analyzer is unreachable rather than silently showing stale data.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Features
        </p>
        <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          A language toolkit, end to end
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={(index % 3) * 0.08}>
            <article className="group h-full rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-7 transition-colors hover:border-accent/40">
              <div className="mb-4 h-1 w-10 rounded-full bg-gradient-to-r from-amber via-orange to-rose transition-all group-hover:w-16" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                {feature.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
