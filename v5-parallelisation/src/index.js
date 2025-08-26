import { generateMap } from "./hasteMap.js";
import { Worker } from "./worker.js";
import { reportResult } from "./reporters.js";

const testFiles = generateMap(".test.js").testFiles;
const worker = new Worker("./src/runner.js");

await Promise.all(
  testFiles.map(async (file) => {
    const result = await worker.run(file);
    reportResult(result);
  })
);
