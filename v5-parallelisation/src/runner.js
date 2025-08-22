import { runTest } from "./runTest.js";

process.on("message", async ({ jobName, payload }) => {
  try {
    const result = await runTest(payload);
    process.send?.({ result });
  } catch (err) {
    process.send?.({ success: false, errorMessage: err.message });
  }
});
