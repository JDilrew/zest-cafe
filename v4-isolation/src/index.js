import * as glob from "glob";
import { runTest } from "./runner.js";

const testFiles = glob.sync("**/*.test.js");

for (const index in testFiles) {
  const file = testFiles[index];

  await runTest(file);
}
