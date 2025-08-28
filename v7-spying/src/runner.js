import { runTest } from "./runTest.js";

process.on("message", async (testFile) => {
  const result = await runTest(testFile);
  process.send?.({ result });
});
