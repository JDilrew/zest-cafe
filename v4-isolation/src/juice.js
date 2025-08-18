import { expect } from "./matchers.js";

let tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

async function run() {
  for (const test of tests) {
    try {
      await test.fn();
      console.log(`✓ ${test.name}`);
    } catch (err) {
      console.error(`✗ ${test.name}`, err);
    }
  }
}

function resetTestState() {
  tests = [];
}

export { test, expect, run, resetTestState };
