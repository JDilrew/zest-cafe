import fs from "fs";
import path from "path";
import { transpileToCommonJS } from "./transform.js";

// naive module cache
const cache = new Map();

function requireModule(modulePath, baseDir) {
  const absPath = path.resolve(baseDir, modulePath);

  if (cache.has(absPath)) return cache.get(absPath);

  const code = fs.readFileSync(absPath, "utf8");
  const transpiled = transpileToCommonJS(code, absPath);

  const module = { exports: {} };

  // each module gets its own "scoped" require
  const localRequire = (p) => requireModule(p, path.dirname(absPath));

  const wrapped = new Function("require", "module", "exports", transpiled);
  wrapped(localRequire, module, module.exports);

  cache.set(absPath, module.exports);
  return module.exports;
}

export { requireModule };
