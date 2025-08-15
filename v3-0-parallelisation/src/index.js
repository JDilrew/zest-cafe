import * as glob from "glob";

// ignore
import { expect } from "./matchers.js";
import { runTest } from "./runner.js";

const testFiles = glob.sync("**/*.test.js");

// for (const index in testFiles) {
//   const file = testFiles[index];
const results = [];

console.log(testFiles);

await Promise.all(
  Array.from(testFiles).map(async (testFile) => {
    // console.log("runnin");
    // const res = await runTest(testFile);
    // results.push(res);
    console.log(await runTest(testFile));
  })
);

// for (const res of results) {
//   console.log(res);
// }

// const result = await runTest(file);

// console.log(result);
// }
