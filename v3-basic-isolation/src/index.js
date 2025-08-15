import * as glob from "glob";

// ignore
import { expect } from "./matchers.js";
import { runTest } from "./runner.js";

const testFiles = glob.sync("**/*.test.js");

for (const index in testFiles) {
  const file = testFiles[index];

  const result = await runTest(file);

  console.log(result);
}
