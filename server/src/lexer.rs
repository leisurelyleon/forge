//! A small, dependency-free tokenizer for C-family source (JavaScript, JSON,
//! Rust-ish). It is pure logic: it takes a string and produces tokens with
//! positions, plus a flag for any unterminated construct. No I/O lives here.

/// The lexical category of a token.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TokenKind {
    Whitespace,
    LineComment,
    BlockComment,
    String,
    Number,
    Identifier,
    Keyword,
    Punctuation,
    Operator,
    Unknown,
}

impl TokenKind {
    /// Stable lowercase name used on the wire and for editor highlighting.
    pub fn name(self) -> &'static str {
        match self {
            TokenKind::Whitespace => "whitespace",
            TokenKind::LineComment => "line-comment",
            TokenKind::BlockComment => "block-comment",
            TokenKind::String => "string",
            TokenKind::Number => "number",
            TokenKind::Identifier => "identifier",
            TokenKind::Keyword => "keyword",
            TokenKind::Punctuation => "punctuation",
            TokenKind::Operator => "operator",
            TokenKind::Unknown => "unknown",
        }
    }
}

/// A lexed token, carrying its source text and 1-based start position, plus
/// the line on which it ends (for multi-line strings and block comments).
#[derive(Debug, Clone)]
pub struct LexedToken {
    pub kind: TokenKind,
    pub value: String,
    pub line: usize,
    pub col: usize,
    pub end_line: usize,
    /// Set when a string or block comment ran off the end of the input.
    pub unterminated: bool,
}

const OPERATOR_CHARS: &str = "+-*/%=<>!&|^~?:";
const PUNCTUATION_CHARS: &str = "{}[]()<>,.;";

/// Tokenize the source for the given language. The language name only selects
/// the keyword set; the lexical grammar is shared across the C family.
pub fn tokenize(source: &str, language: &str) -> Vec<LexedToken> {
    let keywords = keywords_for(language);
    let chars: Vec<char> = source.chars().collect();
    let mut tokens = Vec::new();

    let mut index = 0;
    let mut line = 1;
    let mut col = 1;

    while index < chars.len() {
        let start_line = line;
        let start_col = col;
        let ch = chars[index];

        // Whitespace (including newlines).
        if ch.is_whitespace() {
            let mut value = String::new();
            while index < chars.len() && chars[index].is_whitespace() {
                let c = chars[index];
                value.push(c);
                advance(c, &mut line, &mut col);
                index += 1;
            }
            tokens.push(LexedToken {
                kind: TokenKind::Whitespace,
                value,
                line: start_line,
                col: start_col,
                end_line: line,
                unterminated: false,
            });
            continue;
        }

        // Line comment.
        if ch == '/' && peek(&chars, index + 1) == Some('/') {
            let mut value = String::new();
            while index < chars.len() && chars[index] != '\n' {
                value.push(chars[index]);
                col += 1;
                index += 1;
            }
            tokens.push(LexedToken {
                kind: TokenKind::LineComment,
                value,
                line: start_line,
                col: start_col,
                end_line: line,
                unterminated: false,
            });
            continue;
        }

        // Block comment.
        if ch == '/' && peek(&chars, index + 1) == Some('*') {
            let mut value = String::from("/*");
            index += 2;
            col += 2;
            let mut closed = false;
            while index < chars.len() {
                let c = chars[index];
                if c == '*' && peek(&chars, index + 1) == Some('/') {
                    value.push_str("*/");
                    col += 2;
                    index += 2;
                    closed = true;
                    break;
                }
                value.push(c);
                advance(c, &mut line, &mut col);
                index += 1;
            }
            tokens.push(LexedToken {
                kind: TokenKind::BlockComment,
                value,
                line: start_line,
                col: start_col,
                end_line: line,
                unterminated: !closed,
            });
            continue;
        }

        // String literal (double or single quoted, with escapes).
        if ch == '"' || ch == '\'' {
            let quote = ch;
            let mut value = String::new();
            value.push(ch);
            col += 1;
            index += 1;
            let mut closed = false;
            while index < chars.len() {
                let c = chars[index];
                value.push(c);
                if c == '\\' {
                    // Consume the escaped character verbatim.
                    advance(c, &mut line, &mut col);
                    index += 1;
                    if index < chars.len() {
                        let escaped = chars[index];
                        value.push(escaped);
                        advance(escaped, &mut line, &mut col);
                        index += 1;
                    }
                    continue;
                }
                advance(c, &mut line, &mut col);
                index += 1;
                if c == quote {
                    closed = true;
                    break;
                }
            }
            tokens.push(LexedToken {
                kind: TokenKind::String,
                value,
                line: start_line,
                col: start_col,
                end_line: line,
                unterminated: !closed,
            });
            continue;
        }

        // Number (integer or float, optionally with a leading sign handled as
        // an operator elsewhere).
        if ch.is_ascii_digit() {
            let mut value = String::new();
            let mut seen_dot = false;
            while index < chars.len() {
                let c = chars[index];
                if c.is_ascii_digit() || c == '_' {
                    value.push(c);
                } else if c == '.'
                    && !seen_dot
                    && peek(&chars, index + 1).is_some_and(|n| n.is_ascii_digit())
                {
                    seen_dot = true;
                    value.push(c);
                } else {
                    break;
                }
                col += 1;
                index += 1;
            }
            tokens.push(LexedToken {
                kind: TokenKind::Number,
                value,
                line: start_line,
                col: start_col,
                end_line: line,
                unterminated: false,
            });
            continue;
        }

        // Identifier or keyword.
        if ch.is_alphabetic() || ch == '_' || ch == '$' {
            let mut value = String::new();
            while index < chars.len() {
                let c = chars[index];
                if c.is_alphanumeric() || c == '_' || c == '$' {
                    value.push(c);
                    col += 1;
                    index += 1;
                } else {
                    break;
                }
            }
            let kind = if keywords.contains(&value.as_str()) {
                TokenKind::Keyword
            } else {
                TokenKind::Identifier
            };
            tokens.push(LexedToken {
                kind,
                value,
                line: start_line,
                col: start_col,
                end_line: line,
                unterminated: false,
            });
            continue;
        }

        // Punctuation.
        if PUNCTUATION_CHARS.contains(ch) {
            col += 1;
            index += 1;
            tokens.push(LexedToken {
                kind: TokenKind::Punctuation,
                value: ch.to_string(),
                line: start_line,
                col: start_col,
                end_line: start_line,
                unterminated: false,
            });
            continue;
        }

        // Operator (greedily consume a run of operator characters).
        if OPERATOR_CHARS.contains(ch) {
            let mut value = String::new();
            while index < chars.len() && OPERATOR_CHARS.contains(chars[index]) {
                value.push(chars[index]);
                col += 1;
                index += 1;
            }
            tokens.push(LexedToken {
                kind: TokenKind::Operator,
                value,
                line: start_line,
                col: start_col,
                end_line: start_line,
                unterminated: false,
            });
            continue;
        }

        // Anything else.
        col += 1;
        index += 1;
        tokens.push(LexedToken {
            kind: TokenKind::Unknown,
            value: ch.to_string(),
            line: start_line,
            col: start_col,
            end_line: start_line,
            unterminated: false,
        });
    }

    tokens
}

fn advance(c: char, line: &mut usize, col: &mut usize) {
    if c == '\n' {
        *line += 1;
        *col = 1;
    } else {
        *col += 1;
    }
}

fn peek(chars: &[char], index: usize) -> Option<char> {
    chars.get(index).copied()
}

fn keywords_for(language: &str) -> &'static [&'static str] {
    match language {
        "rust" => &[
            "fn", "let", "mut", "const", "struct", "enum", "impl", "trait", "pub", "use", "mod",
            "match", "if", "else", "for", "while", "loop", "return", "self", "Self", "where",
            "async", "await", "move", "ref", "as", "dyn", "in", "break", "continue", "true",
            "false",
        ],
        "json" => &["true", "false", "null"],
        // Default to a JavaScript/TypeScript keyword set.
        _ => &[
            "function",
            "const",
            "let",
            "var",
            "return",
            "if",
            "else",
            "for",
            "while",
            "do",
            "switch",
            "case",
            "break",
            "continue",
            "class",
            "extends",
            "new",
            "this",
            "super",
            "import",
            "export",
            "from",
            "default",
            "async",
            "await",
            "try",
            "catch",
            "finally",
            "throw",
            "typeof",
            "instanceof",
            "in",
            "of",
            "true",
            "false",
            "null",
            "undefined",
        ],
    }
}
