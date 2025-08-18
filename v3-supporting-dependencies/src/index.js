import * as glob from "glob";
import { runTest } from "./runner.js";
import { expect } from "./matchers.js";
globalThis.expect = expect;

const testFiles = glob.sync("**/*.test.js");

// shuffle them in place (Fisher–Yates)
for (let i = testFiles.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [testFiles[i], testFiles[j]] = [testFiles[j], testFiles[i]];
}

for (const index in testFiles) {
  const file = testFiles[index];

  const result = await runTest(file);

  console.log(result);
}
