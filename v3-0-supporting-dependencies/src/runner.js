import fs from "fs";
async function runTest(testFile) {
  const contents = await fs.promises.readFile(testFile, "utf8");
  const testResult = {
    test: testFile,
    success: false,
    errorMessage: null,
  };

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
