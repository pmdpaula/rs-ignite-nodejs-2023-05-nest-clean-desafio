import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true, // This is required to use the `test` object in the test files without importing it and include "types": ["vitest/globals"] at tsconfig file
    root: "./",
    include: ["**/change-password-receiver.controller.e2e-spec.ts"],
    exclude: ["./data", "./dist/**/*", "./node_modules/**/*", "./test/**/*"],
    setupFiles: ["./test/setup-e2e.ts"], // This is required to run the setup file before running the tests
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
