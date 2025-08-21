import { generateMap } from "./hasteMap.js";
import { runTest } from "./runner.js";

const testFiles = generateMap(".test.js").testFiles;

for (const index in testFiles) {
  const file = testFiles[index];

  await runTest(file);
}
