import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true, // This is required to use the `test` object in the test files without importing it and include "types": ["vitest/globals"] at tsconfig file
    root: "./",
    exclude: ["./data/**/*", "./dist/**/*", "./node_modules/**/*", "./test/**/*"],
  },
  plugins: [
    tsConfigPaths(),
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: "es6" },
    }),
  ],
});
