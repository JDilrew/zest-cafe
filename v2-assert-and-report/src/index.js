import { generateMap } from "./hasteMap.js";
import { runTest } from "./runner.js";
import { expect } from "./matchers.js";

globalThis.expect = expect;

const testFiles = generateMap(".test.js").testFiles;

for (const index in testFiles) {
  const file = testFiles[index];

  const result = await runTest(file);

  console.log(result);
}
