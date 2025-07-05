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

export async function extract(input) {
    let bin;
    if (typeof input?.then === "function") {
        bin = await WebAssembly.instantiateStreaming(input);
    } else if (typeof input === "string") {
        bin = await WebAssembly.instantiateStreaming(fetch(input));
    } else if (input instanceof Response) {
        bin = await WebAssembly.instantiateStreaming(input);
    } else if (input instanceof ArrayBuffer) {
        bin = await WebAssembly.instantiate(input);
    } else if (input instanceof Uint8Array) {
        bin = await WebAssembly.instantiate(input.buffer);
    }

    const mod = bin.instance.exports;
    const payload = WebAssembly.Module.customSections(bin.module, "pp");
    const raw_length_view = WebAssembly.Module.customSections(bin.module, "pr");
    const view = new DataView(raw_length_view[0]);
    const raw_length = view.getUint32(0, true);
    const ptr = mod.resize(payload[0].byteLength);
    const view1 = new Uint8Array(mod.memory.buffer);
    view1.set(new Uint8Array(payload[0]), ptr);
    mod.compile(payload[0].byteLength, raw_length);
    const view2 = new Uint8Array(mod.memory.buffer);
    const offset = mod.offset();
    const size = mod.size();
    return view2.slice(offset, size + offset);
}