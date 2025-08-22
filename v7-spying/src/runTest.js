import fs from "fs";
import path from "path";
import vm, { compileFunction } from "vm";
import { transpileToCommonJS } from "./transform.js";
import * as juiceEngine from "./juice.js";
import { ZestResolver } from "./resolver.js";

function spyOn(obj, key) {
  const original = obj[key];
  if (typeof original !== "function") {
    throw new TypeError(`${key} is not a function`);
  }

  function spy(...args) {
    spy.calls.push(args);
    return original.apply(this, args);
  }

  spy.calls = [];
  spy.mockRestore = () => (obj[key] = original);

  obj[key] = spy;
  return spy;
}

async function runTest(testFile) {
  const contents = await fs.promises.readFile(testFile, "utf8");
  const compiledContents = transpileToCommonJS(contents, testFile);

  const resolver = new ZestResolver();

  // Create a fresh VM context per test file
  const sandbox = { console };
  sandbox.global = sandbox.globalThis = sandbox;
  const testContext = vm.createContext(sandbox);

  juiceEngine.resetTestState();

  // Inject globals (engine + expect)
  testContext.globalThis.require = (m) =>
    resolver.requireModuleOrMock(m, path.dirname(testFile));
  testContext.globalThis.test = juiceEngine.test;
  testContext.globalThis.expect = juiceEngine.expect;
  testContext.globalThis.run = juiceEngine.run;

  testContext.zest = {
    mock: (moduleName, mockImpl) => resolver.registerMock(moduleName, mockImpl),
    spyOn: (obj, key) => spyOn(obj, key),
  };

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

    const module = { exports: {}, require: testContext.require };
    fn(module, module.exports, module.require);

    // Run the juice engine inside of the context
    await vm.runInContext("run()", testContext);

    return { test: testFile, success: true };
  } catch (ex) {
    console.error(`✗ ${testFile}`, ex);
    return { test: testFile, success: false, errorMessage: ex.message };
  }
}

export { runTest };
