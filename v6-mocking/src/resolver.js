import fs from "fs";
import path from "path";
import { transpileToCommonJS } from "./transform.js";

class ZestResolver {
  constructor() {
    this.cache = new Map();
    this.mocks = new Map();
  }

  registerMock(moduleName, mockImpl) {
    this.mocks.set(moduleName, mockImpl);
  }

  requireModuleOrMock(modulePath, baseDir) {
    const absPath = path.resolve(baseDir, modulePath);

    if (this.mocks.has(modulePath)) return this.mocks.get(modulePath);

    if (this.cache.has(absPath)) return this.cache.get(absPath);

    const code = fs.readFileSync(absPath, "utf8");
    const transpiled = transpileToCommonJS(code, absPath);

    const module = { exports: {} };

    // each module gets its own "scoped" require
    const localRequire = (p) =>
      this.requireModuleOrMock(p, path.dirname(absPath));

    const wrapped = new Function("require", "module", "exports", transpiled);
    wrapped(localRequire, module, module.exports);

    this.cache.set(absPath, module.exports);
    return module.exports;
  }

  clearCache() {
    this.cache.clear();
  }
}

export { ZestResolver };
