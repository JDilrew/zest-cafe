import * as glob from "glob";
import { Worker } from "./worker.js";

const testFiles = glob.sync("**/*.test.js");
const worker = new Worker("./src/runner.js");

const promises = testFiles.map((file) => worker.run("runTest", file));

// Kick off all jobs in parallel
const results = await Promise.all(promises);

console.log("Results:", results);
