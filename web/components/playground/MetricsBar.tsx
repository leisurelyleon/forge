"use client";

import type { Metrics } from "@/lib/api/types";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";

interface MetricsBarProps {
  metrics: Metrics | null;
}

const EMPTY: Metrics = {
  lines: 0,
  characters: 0,
  tokens: 0,
  comments: 0,
  strings: 0,
  max_depth: 0,
};

export function MetricsBar({ metrics }: MetricsBarProps) {
  const data = metrics ?? EMPTY;
  const items: { label: string; value: number }[] = [
    { label: "Lines", value: data.lines },
    { label: "Tokens", value: data.tokens },
    { label: "Chars", value: data.characters },
    { label: "Comments", value: data.comments },
    { label: "Strings", value: data.strings },
    { label: "Max depth", value: data.max_depth },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2"
        >
          <AnimatedNumber
            value={item.value}
            className="font-mono text-lg font-bold tabular-nums text-foreground"
          />
          <div className="text-[0.65rem] uppercase tracking-wider text-foreground/50">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
