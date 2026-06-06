"use client";

import { useEffect, useRef, useState } from "react";
import { analyzeSource } from "@/lib/api/client";
import type { AnalyzeResponse, RequestStatus } from "@/lib/api/types";

export interface UseAnalyzer {
  result: AnalyzeResponse | null;
  status: RequestStatus;
  error: string | null;
}

/**
 * Debounced analyze-on-type. Re-analyzes whenever the source or language
 * settles for `debounceMs`, and guards against out-of-order responses with a
 * monotonic request id so a slow earlier request can never overwrite a newer
 * result.
 */
export function useAnalyzer(
  source: string,
  language: string,
  debounceMs = 400,
): UseAnalyzer {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const handle = setTimeout(() => {
      const id = requestId.current + 1;
      requestId.current = id;
      setStatus("loading");
      setError(null);

      analyzeSource(language, source)
        .then((response) => {
          if (id === requestId.current) {
            setResult(response);
            setStatus("success");
          }
        })
        .catch((err: unknown) => {
          if (id === requestId.current) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Analysis failed.");
          }
        });
    }, debounceMs);

    return () => clearTimeout(handle);
  }, [source, language, debounceMs]);

  return { result, status, error };
}
