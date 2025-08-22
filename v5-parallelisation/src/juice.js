import { expect } from "./matchers.js";

let tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

async function run() {
  const results = [];

  for (const test of tests) {
    try {
      await test.fn();
      const result = { name: test.name, status: "passed" };
      results.push(result);
      process.send?.({ event: "test_passed", result });
    } catch (err) {
      const result = { name: test.name, status: "failed", error: err.message };
      results.push(result);
      process.send?.({ event: "test_failed", result });
    }
  }

  // Final summary
  process.send?.({ event: "run_complete", results });
}

function reset() {
  tests = [];
}

export { test, expect, run, reset };
