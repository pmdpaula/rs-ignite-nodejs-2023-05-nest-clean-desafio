import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    files: ["{src,test,apps,libs}/**/*.ts"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "import": simpleImportSort,
    },
    rules: {
      'indent': ['warn', 2, {
        SwitchCase: 1,
      }],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'double'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['warn', {
        ignoreClassWithStaticInitBlock: true,
        caughtErrors: "none",
        // argsIgnorePattern: "^_"
      }],
      '@typescript-eslint/no-unused-vars': 'warn',
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"]
      },
      "import/resolver": {
        "typescript": {
          "alwaysTryTypes": true
        }
      }
    }
  },
];
