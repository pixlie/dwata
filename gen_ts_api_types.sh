export TS_RS_EXPORT_DIR="../src/api_types"

[ -e src/api_types ] && rm -rf src/api_types

cd src-tauri && \
    cargo test && \
    cd .. && \
    pnpm prettier src/api_types --write
