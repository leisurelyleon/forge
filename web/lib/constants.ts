export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "playground", label: "Playground" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS: string[] = NAV_ITEMS.map((item) => item.id);

/**
 * Resolve the analyzer base URL. In production this comes from the Vercel
 * environment variable; locally it falls back to the dev server. Any trailing
 * slash is trimmed so path joins stay clean.
 */
export function resolveApiUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, "");
  }
  return "http://localhost:8080";
}

export interface LanguageOption {
  id: string;
  label: string;
  monaco: string;
}

/** Languages the analyzer understands; `monaco` is the editor's mode id. */
export const LANGUAGES: LanguageOption[] = [
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "rust", label: "Rust", monaco: "rust" },
  { id: "json", label: "JSON", monaco: "json" },
];

/** Starter snippets loaded into the editor per language. */
export const SAMPLES: Record<string, string> = {
  javascript: `function fib(n) {
  if (n < 2) return n;
  // TODO: memoize this
  return fib(n - 1) + fib(n - 2);
}

const result = fib(10);
console.log("fib(10) =", result);`,
  rust: `fn main() {
    let mut total = 0;
    for i in 0..10 {
        total += i;
    }
    println!("sum = {total}");
}`,
  json: `{
  "name": "forge",
  "version": "0.1.0",
  "tags": ["rust", "next", "monaco"],
  "nested": { "ok": true, "count": 3 }
}`,
};

/** Token kind -> Tailwind text color, for the token legend. */
export const TOKEN_COLORS: Record<string, string> = {
  keyword: "text-violet",
  string: "text-amber",
  number: "text-orange",
  "line-comment": "text-muted",
  "block-comment": "text-muted",
  identifier: "text-foreground",
  operator: "text-rose",
  punctuation: "text-foreground/60",
  unknown: "text-rose",
};
