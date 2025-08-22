import { generateMap } from "./hasteMap.js";
import { Worker } from "./worker.js";

const testFiles = generateMap(".test.js").testFiles;
const worker = new Worker("./src/runner.js");

const promises = testFiles.map((file) => worker.run("runTest", file));

// Kick off all jobs in parallel
const results = await Promise.all(promises);

for (const file of results) {
  console.log(`\n📄 ${file.fileName}`);
  for (const test of file.results) {
    if (test.status === "passed") {
      console.log(`  ✓ ${test.name}`);
    } else if (test.status === "failed") {
      console.log(`  ✗ ${test.name}`);
      if (test.error) {
        console.log(`    ↳ ${test.error}`);
      }
    }
  }
}
