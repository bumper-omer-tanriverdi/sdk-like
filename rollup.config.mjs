import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url))
);
const version = pkg.version;

export default {
  input: "src/index.js",
  output: [
    {
      file: `dist/myapp-sdk-${version}.min.js`,
      format: "iife",
      name: "MyAppSDK",
      sourcemap: true,
      banner: `/*! ${pkg.name} v${version} */`,
    },
    {
      file: `dist/myapp-sdk.min.js`, // Ana dosya (main için)
      format: "iife",
      name: "MyAppSDK",
      sourcemap: true,
      banner: `/*! ${pkg.name} v${version} */`,
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    replace({
      preventAssignment: true,
      SDK_VERSION: JSON.stringify(version),
    }),
    terser(),
  ],
};
