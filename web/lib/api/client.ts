import type { AnalyzeResponse, FormatResponse } from "@/lib/api/types";
import { resolveApiUrl } from "@/lib/constants";

const TIMEOUT_MS = 8000;

/**
 * POST JSON to the analyzer service with a hard timeout. Throws a readable
 * Error on non-2xx, abort, or network failure so callers can show an honest
 * message instead of hanging.
 */
async function postJson<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${resolveApiUrl()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(
        `Request failed (${response.status} ${response.statusText}).`,
      );
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out.");
    }
    throw error instanceof Error ? error : new Error("Network error.");
  } finally {
    clearTimeout(timer);
  }
}

export function analyzeSource(
  language: string,
  source: string,
): Promise<AnalyzeResponse> {
  return postJson<AnalyzeResponse>("/analyze", { language, source });
}

export function formatSource(source: string): Promise<FormatResponse> {
  return postJson<FormatResponse>("/format", { source });
}
