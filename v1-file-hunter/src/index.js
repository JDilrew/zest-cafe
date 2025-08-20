import fs from "fs";
import { generateMap } from "./hasteMap.js";

const map = generateMap(".test.js");
const testFiles = map.testFiles;

console.log(
  `haste-map:\n${JSON.stringify(
    {
      dirtyFiles: map.dirtyFiles,
      dirtyTests: map.dirtyTests,
      testFiles: map.testFiles,
    },
    null,
    2
  )}\n`
);

for (const index in testFiles) {
  const file = testFiles[index];

  const contents = await fs.promises.readFile(file, "utf8");

  try {
    // Evaluates JavaScript code and executes it.
    eval(contents);
  } catch (ex) {
    console.error("Run failed:", ex);
  }
}
