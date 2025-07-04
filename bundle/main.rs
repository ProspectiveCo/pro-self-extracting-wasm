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

use clap::*;
use std::path::Path;
use wasm_opt::{Feature, OptimizationOptions};

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct BundleArgs {
    artifact: String,
}

fn main() {
    let args = BundleArgs::parse();
    let outpath = &Path::new(&args.artifact);
    OptimizationOptions::new_optimize_for_size_aggressively()
        .enable_feature(Feature::BulkMemory)
        .run(outpath, outpath)
        .unwrap();
}
