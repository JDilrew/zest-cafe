import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CACHE_PATH = path.join(ROOT, ".haste-cache.json");

// crude directory ignore list
const IGNORE_LIST = new Set(["node_modules", ".git", ".vscode", ".yarn"]);

// rough dependency pattern
const DEPENDENCY_REGEX =
  /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)|\bimport\s*(?:[^'"]*?from\s*)?['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)|\bexport\s*[^'"]*?\sfrom\s*['"]([^'"]+)['"]/g;

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return { version: 1, root: ROOT, files: {} };
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function crawl(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;

    if (entry.isDirectory()) {
      if (IGNORE_LIST.has(entry.name)) continue;

      crawl(path.join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function extractDependencies(src) {
  const matches = src.matchAll(DEPENDENCY_REGEX);
  const dependencies = [];

  for (const match of matches) {
    const dep = match[1] ?? match[2] ?? match[3] ?? match[4];
    if (dep) dependencies.push(dep);
  }

  return dependencies;
}

function resolveImport(fromRel, spec, filesMap) {
  if (!(spec.startsWith("./") || spec.startsWith("../"))) return null;
  const fromAbs = path.join(ROOT, fromRel);
  const base = path.resolve(path.dirname(fromAbs), spec);
  const candidates = [base, base + ".js", path.join(base, "index.js")].map(
    (abs) => path.relative(ROOT, abs)
  );
  for (const rel of candidates) if (filesMap[rel]) return rel;
  return null;
}

function detectStaleTests(testFiles, staleFiles, filesMap) {
  const staleSet = new Set(staleFiles);
  const out = [];
  for (const test of testFiles) {
    if (staleSet.has(test)) {
      out.push(test);
      continue;
    }
    const specs = filesMap[test]?.deps || [];
    for (const s of specs) {
      const depRel = resolveImport(test, s, filesMap);
      if (depRel && staleSet.has(depRel)) {
        out.push(test);
        break;
      }
    }
  }
  return out;
}

function generateMap(fileEnding) {
  const cache = loadCache();
  const files = crawl(ROOT);

  // Build a new files map, reusing deps when mtime unchanged
  const nextFiles = {};
  const staleFiles = [];
  for (const file of files) {
    const relativePath = path.relative(ROOT, file);
    const stat = fs.statSync(file);
    const prevEntry = cache.files[relativePath];

    if (prevEntry && prevEntry.mtimeMs === stat.mtimeMs) {
      nextFiles[relativePath] = prevEntry;
    } else {
      staleFiles.push(relativePath);

      // this gets read twice, but for sake of an example I'm going to get over it.
      const src = fs.readFileSync(file, "utf8");

      nextFiles[relativePath] = {
        mtimeMs: stat.mtimeMs,
        deps: extractDependencies(src),
      };
    }
  }

  const nextCache = { ...cache, root: ROOT, files: nextFiles };
  saveCache(nextCache);

  const testFiles = Object.keys(nextFiles).filter((f) =>
    f.endsWith(fileEnding)
  );

  const staleTests = detectStaleTests(testFiles, staleFiles, nextFiles);

  return {
    ...nextCache,
    staleFiles,
    staleTests,
    testFiles,
  };
}

export { generateMap };
