import { Reveal } from "@/components/motion/Reveal";

const links = [
  { label: "GitHub", href: "https://github.com/leisurelyleon/forge" },
  {
    label: "Monaco Editor",
    href: "https://microsoft.github.io/monaco-editor/",
  },
  { label: "axum", href: "https://github.com/tokio-rs/axum" },
];

export function Footer() {
  return (
    <footer id="contact" className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-10 text-center sm:p-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Contact
        </p>
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Want to see the rest?
        </h2>
        <p className="mx-auto mt-5 max-w-md text-foreground/65">
          forge is one piece of a larger portfolio of systems and interface
          work. The full source, frontend and Rust backend, is on GitHub.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-foreground/15 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Reveal>

      <p className="mt-12 text-center text-xs text-foreground/40">
        Built with Next.js, TypeScript, Tailwind, Monaco, Rust, and axum.
      </p>
    </footer>
  );
}
