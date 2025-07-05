import "zx/globals";

await $`cargo build \
    --color always \
    --release \
    -Z build-std-features=panic_immediate_abort \
    -Z build-std=std,panic_abort \
    --lib \
    --target wasm32-unknown-unknown \
    -p runtime`;

await $`cargo run \
    --color always \
    -p bundle \
    target/wasm32-unknown-unknown/release/runtime.wasm`;

await $`cp target/wasm32-unknown-unknown/release/runtime.wasm ./runtime.wasm`;