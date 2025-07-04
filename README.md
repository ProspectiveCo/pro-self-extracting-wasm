`pro-self-extracting-wasm` is a CLI utility for compiling self-extracting
WebAssembly executables for use in the browser.

## Usage

Install the CLI compiler and runtime library

```bash
npm install pro-self-extracting-wasm
```

Compile your target

```bash
npx pro_self_extracting_wasm ./my_assembly.wasm --output my_assembly.wasm.bundle
```

Unzip the bundle in JavaScript

```javascript
import {extract} from "pro-self-extracting-wasm";
const my_assembly = extract(fetch("./my_assembly.wasm.bundle"));
```

