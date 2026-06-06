use serde::{Deserialize, Serialize};

/// A request to analyze a snippet of source code.
#[derive(Debug, Clone, Deserialize)]
pub struct AnalyzeRequest {
    pub language: String,
    pub source: String,
}

/// A single lexical token with its 1-based position.
#[derive(Debug, Clone, Serialize)]
pub struct Token {
    pub kind: String,
    pub value: String,
    pub line: usize,
    pub col: usize,
}

/// A diagnostic produced while analyzing the token stream.
#[derive(Debug, Clone, Serialize)]
pub struct Diagnostic {
    pub severity: String,
    pub message: String,
    pub line: usize,
    pub col: usize,
}

/// Aggregate metrics over the snippet.
#[derive(Debug, Clone, Serialize)]
pub struct Metrics {
    pub lines: usize,
    pub characters: usize,
    pub tokens: usize,
    pub comments: usize,
    pub strings: usize,
    pub max_depth: usize,
}

/// The full analysis result returned to the editor.
#[derive(Debug, Clone, Serialize)]
pub struct AnalyzeResponse {
    pub language: String,
    pub tokens: Vec<Token>,
    pub diagnostics: Vec<Diagnostic>,
    pub metrics: Metrics,
}

/// A request to re-indent a snippet.
#[derive(Debug, Clone, Deserialize)]
pub struct FormatRequest {
    pub source: String,
}

/// The re-indented source.
#[derive(Debug, Clone, Serialize)]
pub struct FormatResponse {
    pub formatted: String,
    pub changed: bool,
}
