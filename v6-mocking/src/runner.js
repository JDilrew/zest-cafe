import { runTest } from "./runTest.js";

process.on("message", async (testFile) => {
  try {
    const result = await runTest(testFile);
    process.send?.({ result });
  } catch (err) {
    process.send?.({ success: false, errorMessage: err.message });
  }
});
