// eslint.config.ts
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import { jsdoc } from 'eslint-plugin-jsdoc';
// import oxlint from 'eslint-plugin-oxlint';
import  importX from  "eslint-plugin-import-x";
import  nodeLint from  "eslint-plugin-n";
import  pluginPromise from  "eslint-plugin-promise";
import  eslintPluginUnicorn from  "eslint-plugin-unicorn";
import eslintVitestPlugin from "@vitest/eslint-plugin"
// import parser from '@typescript-eslint/parser';

// const arrowFunctionConfig = preferArrowFunctions.configs?.all as Config;

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  // @ts-expect-error trash plugin
  preferArrowFunctions.configs.all,
  jsdoc({ config: 'flat/recommended-typescript' }),
  importX.flatConfigs.typescript,
  nodeLint.configs['flat/recommended-module'],
  pluginPromise.configs['flat/recommended'],
  eslintPluginUnicorn.configs.recommended,
  eslintVitestPlugin.configs.recommended,
  // ...oxlint.buildFromOxlintConfigFile('.oxlintrc.json', { typeAware: true }), // always keep last
  globalIgnores([
    'dist',
    // '*.local/*',
    'node_modules/**',
    '*.config.ts',
    'vitest.setup.ts',
    'tests/*',
  ]),
  {
    files: ['**/*.{js,cjs,mjs,ts,cts,mts}'],
    // plugins: { 'prefer-arrow-functions': preferArrowFunctions},
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      'prefer-arrow-callback': ['warn', { allowNamedFunctions: false }],
      // "prefer-arrow-callback": ["warn"],
      // 'prefer-arrow-functions/prefer-arrow-functions': [
      //   'warn',
      //   {
      //     // allowNamedFunctions: true,
      //     // allowObjectProperties: true,
      //     // classPropertiesAllowed: false,
      //     // disallowPrototype: false,
      //     returnStyle: 'implicit',
      //     // singleReturnOnly: false,
      //   },
      // ],
      'unicorn/better-regex': ['warn'],
      'unicorn/prefer-import-meta-properties': ['warn'],
      'unicorn/prefer-json-parse-buffer': ['warn'],
    },
  },
);
