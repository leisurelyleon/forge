"use client";

import type { Diagnostic, Severity } from "@/lib/api/types";

interface DiagnosticsPanelProps {
  diagnostics: Diagnostic[];
}

const SEVERITY_COLOR: Record<Severity, string> = {
  error: "text-rose",
  warning: "text-amber",
  info: "text-accent",
};

const SEVERITY_DOT: Record<Severity, string> = {
  error: "bg-rose",
  warning: "bg-amber",
  info: "bg-accent",
};

export function DiagnosticsPanel({ diagnostics }: DiagnosticsPanelProps) {
  if (diagnostics.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-sm text-foreground/50">
        <span className="h-2 w-2 rounded-full bg-accent" />
        No issues found.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {diagnostics.map((diagnostic, index) => (
        <li
          key={`${diagnostic.line}-${diagnostic.col}-${index}`}
          className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3"
        >
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[diagnostic.severity]}`} />
          <div className="min-w-0">
            <p className="text-sm text-foreground/85">{diagnostic.message}</p>
            <p className={`mt-0.5 font-mono text-xs ${SEVERITY_COLOR[diagnostic.severity]}`}>
              {diagnostic.severity} · line {diagnostic.line}, col {diagnostic.col}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
