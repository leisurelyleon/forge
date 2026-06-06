"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useAnalyzer } from "@/lib/hooks/useAnalyzer";
import { formatSource } from "@/lib/api/client";
import { LANGUAGES, SAMPLES } from "@/lib/constants";
import { Toolbar } from "@/components/playground/Toolbar";
import { MetricsBar } from "@/components/playground/MetricsBar";
import { DiagnosticsPanel } from "@/components/playground/DiagnosticsPanel";

// Monaco is browser-only; load it client-side with a skeleton fallback.
const CodeEditor = dynamic(() => import("@/components/playground/Editor"), {
  ssr: false,
  loading: () => (
    <div className="grid-texture flex h-full items-center justify-center text-sm text-foreground/40">
      Loading editor…
    </div>
  ),
});

export function Playground() {
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [source, setSource] = useState(SAMPLES[LANGUAGES[0].id]);
  const [formatting, setFormatting] = useState(false);

  const { result, status, error } = useAnalyzer(source, language);

  const changeLanguage = useCallback((id: string) => {
    setLanguage(id);
    setSource(SAMPLES[id] ?? "");
  }, []);

  const loadSample = useCallback(() => {
    setSource(SAMPLES[language] ?? "");
  }, [language]);

  const handleFormat = useCallback(async () => {
    setFormatting(true);
    try {
      const formatted = await formatSource(source);
      setSource(formatted.formatted);
    } catch {
      // A failure here also surfaces through the analyzer status banner.
    } finally {
      setFormatting(false);
    }
  }, [source]);

  const monacoLanguage =
    LANGUAGES.find((lang) => lang.id === language)?.monaco ?? "plaintext";

  return (
    <section id="playground" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Playground
        </p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Type code, analyzed live
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] lg:col-span-2">
          <Toolbar
            language={language}
            onLanguageChange={changeLanguage}
            onLoadSample={loadSample}
            onFormat={handleFormat}
            status={status}
            formatting={formatting}
          />
          <div className="h-[420px]">
            <CodeEditor
              value={source}
              language={monacoLanguage}
              onChange={setSource}
            />
          </div>
        </div>

        <div className="space-y-5">
          {error && (
            <div className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose">
              {error} Is the analyzer running?
            </div>
          )}
          <MetricsBar metrics={result?.metrics ?? null} />
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground/70">
              Diagnostics
            </h3>
            <DiagnosticsPanel diagnostics={result?.diagnostics ?? []} />
          </div>
        </div>
      </div>
    </section>
  );
}
