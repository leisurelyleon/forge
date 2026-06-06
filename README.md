# forge

An in-browser code playground built on the **Monaco editor** with a **Rust + axum** backend on Fly.io. Type code and a pure-logic tokenizer analyzes it server-side, streaming back live token counts, complexity metrics, and diagnostics — balance checks, unterminated literals, marker comments. The backend also re-indents brace-delimited code on request.

## Highlights

- **Rust language toolkit** — a dependency-free, C-family tokenizer (the real engine) feeds an analysis pass that reports tokens, aggregate metrics, and diagnostics. Pure logic, fully unit-testable, no I/O in the core.
- **Analyze-on-type** — the editor debounces keystrokes and POSTs the buffer to the backend, which returns tokens, diagnostics, and metrics for a live readout.
- **Real diagnostics** — delimiter balance (with mismatch and unclosed detection), unterminated strings and block comments, and TODO/FIXME markers, each with line/column positions.
- **Server-side formatter** — a conservative indentation normalizer that re-indents by net delimiter depth (ignoring brackets inside strings and comments) and leaves multi-line string interiors untouched.
- **Monaco editor** — the engine behind VS Code, integrated via a dynamic, client-only import with light/dark themes wired to the site theme.
- **Honest states** — request timeouts and backend errors surface clearly rather than failing silently.

## Tech stack

**Frontend:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · @monaco-editor/react
**Backend:** Rust · axum · tower-http (CORS) · serde (deployed on Fly.io)

## Project structure

| Path | Purpose |
| --- | --- |
| `server/src/lexer.rs` | Pure C-family tokenizer with positions |
| `server/src/analyze.rs` | Metrics, balance checking, and diagnostics |
| `server/src/format.rs` | Conservative indentation normalizer |
| `server/src/handlers.rs` | HTTP handlers over the pure core |
| `web/components/playground/` | Monaco editor, toolbar, diagnostics, metrics bar |
| `web/lib/api/` | Typed fetch client and the shared wire types |
| `web/lib/hooks/` | Debounced analyzer, theme, scroll spy, reduced motion |

## Local development

```bash
# terminal 1 — the language toolkit service
cd server
cargo run
# serves http://localhost:8080 (POST /analyze, POST /format)
```

```bash
# terminal 2 — the playground
cd web
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | TypeScript, no emit |
| `cargo run` | Run the toolkit service |
| `cargo build --release` | Release build of the server |

## Deployment

- **Backend → Fly.io** from `server/` via its Dockerfile, on an always-on machine.
- **Frontend → Vercel** with the project **Root Directory set to `web`**, and `NEXT_PUBLIC_API_URL` set to `https://<your-app>.fly.dev` (no trailing slash).

## License

MIT — see [LICENSE](./LICENSE).
