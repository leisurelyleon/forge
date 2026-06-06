//! A conservative, best-effort indentation normalizer for brace-delimited
//! code. It re-indents lines by net delimiter depth (computed from the token
//! stream, so brackets inside strings and comments are ignored) and trims
//! trailing whitespace. Lines that continue a multi-line string or block
//! comment are left byte-for-byte untouched.

use crate::lexer::{tokenize, TokenKind};

const INDENT: &str = "  ";

pub fn format(source: &str) -> String {
    let tokens = tokenize(source, "javascript");

    // Lines that are continuations of a multi-line token must not be touched.
    let mut protected = vec![false; source.lines().count() + 2];
    for token in &tokens {
        // Only the interior lines of a multi-line string or block comment are
        // protected; newline-bearing whitespace also spans lines but must not
        // suppress indentation.
        let spans_lines = matches!(token.kind, TokenKind::String | TokenKind::BlockComment);
        if spans_lines && token.end_line > token.line {
            for line in (token.line + 1)..=token.end_line {
                if let Some(slot) = protected.get_mut(line) {
                    *slot = true;
                }
            }
        }
    }

    // Depth at the start of each 1-based line, and whether the line's first
    // token is a closer (which should dedent that line itself).
    let total_lines = source.lines().count().max(1);
    let mut depth_at_line = vec![0i64; total_lines + 2];
    let mut starts_with_closer = vec![false; total_lines + 2];

    let mut depth: i64 = 0;
    let mut current_line = 1;
    depth_at_line[1] = 0;
    let mut seen_token_on_line = vec![false; total_lines + 2];

    for token in &tokens {
        if token.kind == TokenKind::Whitespace {
            // Whitespace can carry newlines; record depth as each line opens.
            let newlines = token.value.matches('\n').count();
            for _ in 0..newlines {
                current_line += 1;
                if let Some(slot) = depth_at_line.get_mut(current_line) {
                    *slot = depth;
                }
            }
            continue;
        }

        let is_closer =
            token.kind == TokenKind::Punctuation && matches!(token.value.as_str(), "}" | "]" | ")");
        if let Some(seen) = seen_token_on_line.get_mut(current_line) {
            if !*seen {
                *seen = true;
                if let Some(slot) = starts_with_closer.get_mut(current_line) {
                    *slot = is_closer;
                }
            }
        }

        if token.kind == TokenKind::Punctuation {
            match token.value.as_str() {
                "{" | "[" | "(" => depth += 1,
                "}" | "]" | ")" => depth = (depth - 1).max(0),
                _ => {}
            }
        }
    }

    let mut out = String::new();
    for (offset, raw) in source.lines().enumerate() {
        let line_no = offset + 1;
        if line_no > 1 {
            out.push('\n');
        }

        if protected.get(line_no).copied().unwrap_or(false) {
            out.push_str(raw.trim_end());
            continue;
        }

        let trimmed = raw.trim();
        if trimmed.is_empty() {
            continue;
        }

        let mut level = depth_at_line.get(line_no).copied().unwrap_or(0);
        if starts_with_closer.get(line_no).copied().unwrap_or(false) {
            level = (level - 1).max(0);
        }

        for _ in 0..level {
            out.push_str(INDENT);
        }
        out.push_str(trimmed);
    }

    out
}
