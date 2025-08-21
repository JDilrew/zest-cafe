import { transformSync } from "@babel/core";

function transpileToCommonJS(input, inputFilePath) {
  const transformedInput = transformSync(input, {
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

  return transformedInput.code;
}

export { transpileToCommonJS };
