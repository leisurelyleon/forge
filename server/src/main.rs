mod analyze;
mod format;
mod handlers;
mod lexer;
mod model;

use axum::routing::{get, post};
use axum::Router;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    // The frontend is served from a different origin (Vercel), so permit
    // cross-origin POSTs from anywhere. This is a stateless, read-only
    // analysis service, so a permissive policy is safe here.
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(handlers::health))
        .route("/health", get(handlers::health))
        .route("/analyze", post(handlers::analyze_handler))
        .route("/format", post(handlers::format_handler))
        .layer(cors);

    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(8080);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind listener");
    println!("forge server listening on {addr}");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("server error");
}

async fn shutdown_signal() {
    let _ = tokio::signal::ctrl_c().await;
}
