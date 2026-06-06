//! HTTP handlers. These are thin: they validate input, call into the pure
//! core (analyze / format), and shape the JSON response.

use axum::http::StatusCode;
use axum::Json;

use crate::analyze::analyze;
use crate::format::format;
use crate::model::{AnalyzeRequest, AnalyzeResponse, FormatRequest, FormatResponse};

/// Liveness probe.
pub async fn health() -> &'static str {
    "forge ok"
}

const MAX_SOURCE_BYTES: usize = 100_000;

/// Analyze a snippet: tokens, diagnostics, and metrics.
pub async fn analyze_handler(
    Json(req): Json<AnalyzeRequest>,
) -> Result<Json<AnalyzeResponse>, (StatusCode, String)> {
    if req.source.len() > MAX_SOURCE_BYTES {
        return Err((
            StatusCode::PAYLOAD_TOO_LARGE,
            "Source exceeds the 100 KB limit.".to_string(),
        ));
    }
    Ok(Json(analyze(&req.source, &req.language)))
}

/// Re-indent a snippet.
pub async fn format_handler(
    Json(req): Json<FormatRequest>,
) -> Result<Json<FormatResponse>, (StatusCode, String)> {
    if req.source.len() > MAX_SOURCE_BYTES {
        return Err((
            StatusCode::PAYLOAD_TOO_LARGE,
            "Source exceeds the 100 KB limit.".to_string(),
        ));
    }
    let formatted = format(&req.source);
    let changed = formatted != req.source;
    Ok(Json(FormatResponse { formatted, changed }))
}
