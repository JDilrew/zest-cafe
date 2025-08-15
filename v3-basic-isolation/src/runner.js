import fs from "fs";
import path from "node:path";

function clearCacheForTest(testFile) {
  const absPath = path.resolve(testFile);
  // Clear this file (and any modules it imported) from the require cache
  Object.keys(require.cache).forEach((key) => {
    if (key.startsWith(absPath) || key.includes(path.dirname(absPath))) {
      delete require.cache[key];
    }
  });
}

async function runTest(testFile) {
  const contents = await fs.promises.readFile(testFile, "utf8");
  const testResult = {
    success: false,
    errorMessage: null,
  };

  clearCacheForTest(testFile);

  try {
    // Evaluates JavaScript code and executes it.
    eval(contents);
    testResult.success = true;
  } catch (ex) {
    testResult.errorMessage = ex.message;
  }

  return testResult;
}

export { runTest };
