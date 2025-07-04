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

const { deflate } = require('node:zlib');
const fs = require("node:fs");

const runtime = fs.readFileSync("./runtime.wasm");

exports.compress = function compress(input, output) {
    const input_data = fs.readFileSync(input);
    deflate(input_data, (err, results) => {
        const buff = Buffer.allocUnsafe(4 + results.byteLength + runtime.byteLength);
        const view = new DataView(buff.buffer);
        view.setUint32(0, results.byteLength, true);
        buff.set(results, 4);
        buff.set(runtime, 4 + results.byteLength);
        fs.writeFileSync(output, buff);
        console.log(`pro_self_extracing_wasm wrote ${buff.byteLength} bytes`);
    });
}

exports.compress_main = function compress_main() {
    let input, output;
    const args = process.argv.slice(2);
    while (args.length > 0) {
        const arg = args.shift();
        if (arg === "--output") {
            output = args.shift();
        } else {
            input = arg;
        }
    }

    exports.compress(input, output || input)
}
