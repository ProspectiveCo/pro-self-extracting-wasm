// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │  ██████╗ ██████╗  ██████╗   Copyright (C) 2025, The Prospective Company   │
// │  ██╔══██╗██╔══██╗██╔═══██╗                                                │
// │  ██████╔╝██████╔╝██║   ██║  This file is part of the Procss library,      │
// │  ██╔═══╝ ██╔══██╗██║   ██║  distributed under the terms of the            │
// │  ██║     ██║  ██║╚██████╔╝  Apache License 2.0.  The full license can     │
// │  ╚═╝     ╚═╝  ╚═╝ ╚═════╝   be found in the LICENSE file.                 │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘

//! `pro-self-extracting-wasm` is a self-extracting `zlib` compressed binary.
//! The _best_ way to distribute `.wasm` components is to compress them on disk,
//! then configure your web server to apply the `Content-Encoding: gzip` header
//! _without_ zipping the content, then use the browser's
//! `WebAssembly.instantiateStreaming()` to compile the result. However,
//!  _no one_ in practice does this. While the self-extracing method
//! is certainly slower, larger and more complicated, it works without any
//! special configuration.
//!
//! In the interest of being small, this library does not rely on `wasm_bindgen`
//! so the API is quite low-level - the caller must independently get the size
//! and offset of the uncompressed WASM and `slice()`` this from the process'
//! `WebAssembly.Memory` externally. Afterwards, the compiled wasm archive
//! is garbage-collected by the JavaScript runtime (just like any JS object),
//! freeing the uncompressed memory from the archive.

#![no_std]
#![allow(internal_features, improper_ctypes_definitions, static_mut_refs)]
#![feature(core_intrinsics)]

extern crate alloc;
extern crate wee_alloc;

use alloc::vec::Vec;
use zune_inflate::{DeflateDecoder, DeflateOptions};

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(not(test))]
#[panic_handler]
pub fn panic(_info: &::core::panic::PanicInfo) -> ! {
    ::core::intrinsics::abort();
}

static mut COMPRESSED_BYTES: Vec<u8> = Vec::new();
static mut DECOMPRESSED_BYTES: Vec<u8> = Vec::new();

#[unsafe(no_mangle)]
pub fn resize(size: usize) -> *const u8 {
    unsafe {
        COMPRESSED_BYTES.reserve(size);
        COMPRESSED_BYTES.as_ptr()
    }
}

#[unsafe(no_mangle)]
pub fn size() -> usize {
    unsafe { DECOMPRESSED_BYTES.len() }
}

#[unsafe(no_mangle)]
pub fn offset() -> *const u8 {
    unsafe { DECOMPRESSED_BYTES.as_ptr() }
}

#[unsafe(no_mangle)]
pub fn compile(size: usize, out_size: usize) {
    unsafe { COMPRESSED_BYTES.set_len(size) };
    let options = DeflateOptions::default()
        .set_size_hint(out_size)
        .set_confirm_checksum(false)
        .set_limit(out_size);
    let mut decoder = unsafe { DeflateDecoder::new_with_options(&COMPRESSED_BYTES, options) };
    let v = decoder.decode_zlib().unwrap();
    unsafe {
        DECOMPRESSED_BYTES = v;
    }
}
