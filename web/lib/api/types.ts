/**
 * Wire types — the TypeScript mirror of the Rust `model.rs` shapes returned by
 * the analyzer service. Field names match the JSON exactly (including
 * snake_case `max_depth`).
 */

export interface Token {
  kind: string;
  value: string;
  line: number;
  col: number;
}

export type Severity = "error" | "warning" | "info";

export interface Diagnostic {
  severity: Severity;
  message: string;
  line: number;
  col: number;
}

export interface Metrics {
  lines: number;
  characters: number;
  tokens: number;
  comments: number;
  strings: number;
  max_depth: number;
}

export interface AnalyzeResponse {
  language: string;
  tokens: Token[];
  diagnostics: Diagnostic[];
  metrics: Metrics;
}

export interface FormatResponse {
  formatted: string;
  changed: boolean;
}

/** Lifecycle of an in-flight request, surfaced honestly in the UI. */
export type RequestStatus = "idle" | "loading" | "success" | "error";
