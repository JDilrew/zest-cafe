import fs from "fs";
import path from "path";
import { transpileToCommonJS } from "./transform.js";
import { requireModule } from "./resolver.js";

async function runTest(testFile) {
  const contents = await fs.promises.readFile(testFile, "utf8");

  const compiledContents = transpileToCommonJS(contents, testFile);

  // make global require available so eval scripts have sight of it
  const baseDir = path.dirname(testFile);
  globalThis.require = (moduleName) => requireModule(moduleName, baseDir);

  try {
    eval(compiledContents);
    return { test: testFile, success: true };
  } catch (ex) {
    return { test: testFile, success: false, errorMessage: ex.message };
  }
}

export { runTest };
