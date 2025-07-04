cargo build \
    --release \
    -Z build-std-features=panic_immediate_abort \
    -Z build-std=std,panic_abort \
    --lib \
    --target wasm32-unknown-unknown \
    -p runtime

cargo run \
    -p bundle \
    target/wasm32-unknown-unknown/release/runtime.wasm

cp target/wasm32-unknown-unknown/release/runtime.wasm ./runtime.wasm
