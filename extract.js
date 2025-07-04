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

export async function extract(path) {
    const req = await fetch(path);
    const view = new DataView(await req.arrayBuffer());
    const len = view.getUint32(0, true);
    const payload = view.buffer.slice(4, 4 + len);
    const bin = await WebAssembly.instantiate(view.buffer.slice(4 + len));
    const mod = bin.instance.exports;
    const ptr = mod.resize(payload.byteLength);
    const view1 = new Uint8Array(mod.memory.buffer);
    view1.set(new Uint8Array(payload), ptr);
    mod.compile(payload.byteLength);
    const offset = mod.offset();
    const size = mod.size();
    return view1.slice(offset, size + offset);
}