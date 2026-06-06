"use client";

import { LANGUAGES } from "@/lib/constants";
import type { RequestStatus } from "@/lib/api/types";

interface ToolbarProps {
  language: string;
  onLanguageChange: (id: string) => void;
  onLoadSample: () => void;
  onFormat: () => void;
  status: RequestStatus;
  formatting: boolean;
}

const STATUS_LABEL: Record<RequestStatus, string> = {
  idle: "Idle",
  loading: "Analyzing",
  success: "Analyzed",
  error: "Error",
};

const STATUS_COLOR: Record<RequestStatus, string> = {
  idle: "bg-muted",
  loading: "bg-amber",
  success: "bg-accent",
  error: "bg-rose",
};

export function Toolbar({
  language,
  onLanguageChange,
  onLoadSample,
  onFormat,
  status,
  formatting,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {LANGUAGES.map((lang) => {
          const selected = lang.id === language;
          return (
            <button
              key={lang.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onLanguageChange(lang.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                selected
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-foreground/15 text-foreground/60 hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs text-foreground/60">
          <span
            className={`h-2 w-2 rounded-full ${STATUS_COLOR[status]} ${status === "loading" ? "animate-pulse" : ""}`}
          />
          {STATUS_LABEL[status]}
        </span>
        <button
          type="button"
          onClick={onLoadSample}
          className="rounded-lg border border-foreground/15 px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={onFormat}
          disabled={formatting}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {formatting ? "Formatting…" : "Format"}
        </button>
      </div>
    </div>
  );
}
