import { Reveal } from "@/components/motion/Reveal";

const stats = [
  { value: "3", label: "Languages parsed" },
  { value: "10", label: "Token categories" },
  { value: "0", label: "Charting libraries" },
  { value: "1", label: "Pure-logic core" },
];

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            About
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            A real tokenizer, server-side
          </h2>
          <p className="mt-6 text-foreground/70">
            Every keystroke settles for a moment, then the editor sends the
            buffer to a Rust service. A dependency-free, C-family tokenizer
            turns it into a token stream, and an analysis pass reports metrics
            and diagnostics with exact line and column positions.
          </p>
          <p className="mt-4 text-foreground/70">
            The lexer is pure logic with no I/O, so it is fully testable in
            isolation. The HTTP layer is a thin wrapper around it, and a
            conservative formatter re-indents brace-delimited code on request.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6">
                <div className="font-display text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-foreground/60">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
