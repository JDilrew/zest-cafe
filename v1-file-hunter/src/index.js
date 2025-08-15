import * as glob from "glob";
import fs from "fs";

const testFiles = glob.sync("**/*.test.js");

for (const index in testFiles) {
  const file = testFiles[index];

  const contents = await fs.promises.readFile(file, "utf8");

  console.log(file, contents);

  try {
    // Evaluates JavaScript code and executes it.
    eval(contents);
  } catch (ex) {
    console.error("Run failed:", ex);
  }
}
