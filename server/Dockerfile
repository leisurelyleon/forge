# ---- build stage ----
FROM rust:1-slim-bookworm AS builder
WORKDIR /app

# Cache dependency compilation across source edits.
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release && rm -rf src

COPY src ./src
RUN touch src/main.rs && cargo build --release

# ---- runtime stage ----
FROM debian:bookworm-slim AS runtime
WORKDIR /app
COPY --from=builder /app/target/release/forge-server /usr/local/bin/forge-server
ENV PORT=8080
EXPOSE 8080
CMD ["forge-server"]
