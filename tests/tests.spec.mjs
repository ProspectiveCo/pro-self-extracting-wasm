import { test, expect } from '@playwright/test';
import * as fs from "node:fs";
import "zx/globals";

test("CLI roundtrip", async ({ page }) => {
    await page.goto("http://localhost:3000/tests/index.html");
    await $`node main.mjs README.md --output ./test.wasm`;
    try {
        const results = await page.evaluate(async () => {
            const { extract } = await import("../extract.mjs");
            const req = fetch("../test.wasm");
            const result = await extract(req);
            return new TextDecoder().decode(result.buffer);
        });

        expect(results).toEqual(fs.readFileSync("./README.md").toString());
    } finally {
        fs.unlinkSync("./test.wasm");
    }
});