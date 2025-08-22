import fs from "fs";
import path from "path";
import vm, { compileFunction } from "vm";
import { transpileToCommonJS } from "./transform.js";
import * as juiceEngine from "./juice.js";
import { ZestResolver } from "./resolver.js";

async function runTest(testFile) {
  const contents = await fs.promises.readFile(testFile, "utf8");
  const compiledContents = transpileToCommonJS(contents, testFile);

  const resolver = new ZestResolver();

  // Create a fresh VM context per test file
  const sandbox = { console };
  sandbox.global = sandbox.globalThis = sandbox;
  const testContext = vm.createContext(sandbox);

  juiceEngine.reset();

  // Inject globals (engine + expect)
  testContext.globalThis.require = (m) =>
    resolver.requireModule(m, path.dirname(testFile));
  testContext.globalThis.test = juiceEngine.test;
  testContext.globalThis.expect = juiceEngine.expect;
  testContext.globalThis.run = juiceEngine.run;

  try {
    // Compile and execute the test file in the VM
    const fn = compileFunction(
      compiledContents,
      ["module", "exports", "require"],
      {
        filename: testFile,
        parsingContext: testContext,
      }
    );

    // the test file then populates the test object in the juice engine
    const module = { exports: {}, require: testContext.require };
    fn(module, module.exports, module.require);

    // Run the juice engine inside of the context, now that it contains our tests..
    await vm.runInContext("run()", testContext);
  } catch (ex) {
    console.error(`✗ ${testFile}`, ex);
  }
}

export { runTest };
