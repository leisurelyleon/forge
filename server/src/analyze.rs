//! Pure analysis over the token stream: aggregate metrics, balance checking,
//! and lightweight diagnostics. No I/O; everything here is a function of the
//! tokens and the original source.

use crate::lexer::{tokenize, LexedToken, TokenKind};
use crate::model::{AnalyzeResponse, Diagnostic, Metrics, Token};

/// Run the full analysis pipeline for a snippet.
pub fn analyze(source: &str, language: &str) -> AnalyzeResponse {
    let lexed = tokenize(source, language);

    let tokens = wire_tokens(&lexed);
    let diagnostics = diagnose(&lexed);
    let metrics = measure(source, &lexed);

    AnalyzeResponse {
        language: language.to_string(),
        tokens,
        diagnostics,
        metrics,
    }
}

/// Convert lexer tokens into the wire shape, dropping pure whitespace so the
/// editor only sees meaningful tokens.
fn wire_tokens(lexed: &[LexedToken]) -> Vec<Token> {
    lexed
        .iter()
        .filter(|t| t.kind != TokenKind::Whitespace)
        .map(|t| Token {
            kind: t.kind.name().to_string(),
            value: t.value.clone(),
            line: t.line,
            col: t.col,
        })
        .collect()
}

fn measure(source: &str, lexed: &[LexedToken]) -> Metrics {
    let characters = source.chars().count();
    let lines = if source.is_empty() {
        0
    } else {
        source.lines().count().max(1)
    };

    let mut tokens = 0;
    let mut comments = 0;
    let mut strings = 0;
    let mut depth: i64 = 0;
    let mut max_depth: i64 = 0;

    for token in lexed {
        match token.kind {
            TokenKind::Whitespace => continue,
            TokenKind::LineComment | TokenKind::BlockComment => comments += 1,
            TokenKind::String => strings += 1,
            TokenKind::Punctuation => match token.value.as_str() {
                "{" | "[" | "(" => {
                    depth += 1;
                    max_depth = max_depth.max(depth);
                }
                "}" | "]" | ")" => depth = (depth - 1).max(0),
                _ => {}
            },
            _ => {}
        }
        tokens += 1;
    }

    Metrics {
        lines,
        characters,
        tokens,
        comments,
        strings,
        max_depth: max_depth as usize,
    }
}

fn diagnose(lexed: &[LexedToken]) -> Vec<Diagnostic> {
    let mut diagnostics = Vec::new();
    let mut stack: Vec<(char, usize, usize)> = Vec::new();

    for token in lexed {
        // Unterminated strings and block comments are hard errors.
        if token.unterminated {
            let what = match token.kind {
                TokenKind::String => "string literal",
                TokenKind::BlockComment => "block comment",
                _ => "token",
            };
            diagnostics.push(Diagnostic {
                severity: "error".to_string(),
                message: format!("Unterminated {what}."),
                line: token.line,
                col: token.col,
            });
        }

        // Flag TODO / FIXME markers inside comments as informational.
        if matches!(token.kind, TokenKind::LineComment | TokenKind::BlockComment) {
            let upper = token.value.to_uppercase();
            if upper.contains("TODO") || upper.contains("FIXME") {
                diagnostics.push(Diagnostic {
                    severity: "info".to_string(),
                    message: "Marker comment (TODO/FIXME) found.".to_string(),
                    line: token.line,
                    col: token.col,
                });
            }
        }

        // Track delimiter balance.
        if token.kind == TokenKind::Punctuation {
            match token.value.as_str() {
                "{" | "[" | "(" => {
                    stack.push((token.value.chars().next().unwrap(), token.line, token.col));
                }
                close @ ("}" | "]" | ")") => {
                    let expected = match close {
                        "}" => '{',
                        "]" => '[',
                        _ => '(',
                    };
                    match stack.pop() {
                        Some((open, _, _)) if open == expected => {}
                        Some((open, line, col)) => {
                            diagnostics.push(Diagnostic {
                                severity: "error".to_string(),
                                message: format!(
                                    "Mismatched delimiter: '{open}' is closed by '{close}'."
                                ),
                                line,
                                col,
                            });
                        }
                        None => {
                            diagnostics.push(Diagnostic {
                                severity: "error".to_string(),
                                message: format!("Unexpected closing '{close}'."),
                                line: token.line,
                                col: token.col,
                            });
                        }
                    }
                }
                _ => {}
            }
        }
    }

    // Anything left open at the end is unbalanced.
    for (open, line, col) in stack {
        diagnostics.push(Diagnostic {
            severity: "error".to_string(),
            message: format!("Unclosed '{open}'."),
            line,
            col,
        });
    }

    diagnostics
}
