import { transformSync } from "@babel/core";

function transpileToCommonJS(input, inputFilePath) {
  const firstPass = transformSync(input, {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: "commonjs",
        },
      ],
    ],
    sourceMaps: "inline",
    filename: inputFilePath,
  });

  return firstPass.code;
}

export { transpileToCommonJS };
