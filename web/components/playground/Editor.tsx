"use client";

import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "@/lib/hooks/useTheme";

interface EditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

/**
 * Thin wrapper over the Monaco editor. Loaded via a dynamic, client-only import
 * (see Playground) because Monaco needs the browser and cannot be server
 * rendered. Default export so `next/dynamic` resolves it cleanly.
 */
export default function Editor({ value, language, onChange }: EditorProps) {
  const { theme } = useTheme();

  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme={theme === "dark" ? "vs-dark" : "light"}
      value={value}
      onChange={(next) => onChange(next ?? "")}
      options={{
        fontSize: 14,
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        tabSize: 2,
        renderLineHighlight: "all",
        automaticLayout: true,
      }}
    />
  );
}
