import { generateMap } from "./hasteMap.js";
import { Worker } from "./worker.js";

const testFiles = generateMap(".test.js").testFiles;
const worker = new Worker("./src/runner.js");

const promises = testFiles.map((file) => worker.run("runTest", file));

// Kick off all jobs in parallel
const results = await Promise.all(promises);

console.log("Results:", results);
