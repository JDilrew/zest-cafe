import * as glob from "glob";
import { runTest } from "./runner.js";
import { expect } from "./matchers.js";
globalThis.expect = expect;

const testFiles = glob.sync("**/*.test.js");

for (const index in testFiles) {
  const file = testFiles[index];

  const result = await runTest(file);

  console.log(result);
}
