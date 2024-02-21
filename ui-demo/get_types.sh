rm -rf src/api_types && \
    cd src-tauri && \
    cargo test && \
    cd .. && \
    pnpm prettier src/api_types --write
