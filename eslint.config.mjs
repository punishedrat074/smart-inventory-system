// @ts-check
/**
 * ESLint Flat Config — project root
 *
 * Applies to all workspaces (client/ and server/).
 * Uses ESLint 9 flat config format — the modern standard, replacing .eslintrc.
 *
 * Rule layers (applied in order, later rules override earlier ones):
 *   1. Global ignores
 *   2. Base JavaScript rules (@eslint/js recommended)
 *   3. TypeScript rules (typescript-eslint recommended) — all .ts/.tsx files
 *   4. Import sort rules — all .ts/.tsx files
 *   5. Server-specific environment (Node globals)
 *   6. Client-specific rules (React + browser globals)
 *   7. Prettier — MUST be last (disables formatting rules that conflict)
 */

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default tseslint.config(
  // ─── 1. Global Ignores ───────────────────────────────────────────────────────
  // These paths are excluded from linting entirely.
  // Flat config replaces .eslintignore — ignores are declared here.
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/build/**',
      '.husky/**',
      // Don't lint config files themselves — they use special syntax
      // (e.g., __dirname in vite.config.ts, CJS require in some tools)
      'eslint.config.mjs',
    ],
  },

  // ─── 2. Base JavaScript Rules ────────────────────────────────────────────────
  // Covers fundamental correctness rules for all JS/TS files:
  // no-unused-vars, no-undef, no-console (not included by default), etc.
  js.configs.recommended,

  // ─── 3. TypeScript Rules — all .ts and .tsx files ────────────────────────────
  // Uses typescript-eslint's recommended ruleset (without type-checking).
  // Provides: no-explicit-any, no-unused-vars (TS-aware), consistent-type-imports, etc.
  //
  // Note: "recommendedTypeChecked" would add type-aware rules (no-floating-promises,
  // etc.) but requires tsconfig.json paths to be configured per glob. That can be
  // added in a future task when complexity is warranted. The compiler (strict mode)
  // already catches most type errors at build time.
  ...tseslint.configs.recommended,

  // ─── 4. Import Sort + TypeScript Overrides — all .ts/.tsx ────────────────────
  {
    files: ['**/*.{ts,tsx}'],

    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      // ── Import ordering (ARCHITECTURE.md §8.2) ──────────────────────────────
      // Groups: [side effects] → [external packages] → [internal @/] → [relative]
      // Auto-fixable with `eslint --fix` or `eslint src/ --fix`.
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // ── TypeScript quality rules (ARCHITECTURE.md §8.4) ─────────────────────
      // Enforce `import type` for type-only imports — signals intent, enables
      // isolated module erasure (required by Vite/esbuild).
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // Allow _-prefixed variables as intentionally unused (e.g. _req in Express).
      // The TypeScript compiler already enforces noUnusedLocals/noUnusedParameters,
      // so this rule provides redundancy — but the _-prefix convention is useful
      // to communicate intentional choices to the reader.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // No-explicit-any is in the recommended config already. Keeping it here
      // as documentation of intent — this is a hard rule for this project.
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // ─── 5. Server — Node.js environment ─────────────────────────────────────────
  {
    files: ['server/**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // console.log/error are acceptable in server code during development.
      // In Task 10, these will be replaced by structured logging (Winston/Pino).
      // Do not enable no-console for server files.
    },
  },

  // ─── 6. Client — React + Browser environment ─────────────────────────────────
  {
    files: ['client/**/*.{ts,tsx}'],

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      // 'detect' reads the React version from package.json automatically.
      // Avoids hardcoding a version that becomes stale.
      react: { version: 'detect' },
    },

    rules: {
      // ── Core React rules ─────────────────────────────────────────────────────
      // Each key in a list/array rendered via JSX needs a unique `key` prop.
      // Missing keys cause React to silently mis-reconcile the DOM on re-renders.
      'react/jsx-key': 'error',

      // Prevents passing children as a prop (use JSX children syntax instead).
      'react/no-children-prop': 'error',

      // Prevents use of dangerouslySetInnerHTML — XSS attack vector.
      // If absolutely required, the component must be reviewed and this rule
      // disabled with a comment explaining the sanitization approach.
      'react/no-danger': 'error',

      // Warns on deprecated React APIs (e.g., componentWillMount).
      'react/no-deprecated': 'warn',

      // Prevents directly mutating state (class components).
      'react/no-direct-mutation-state': 'error',

      // Catches unknown HTML attributes passed as JSX props.
      'react/no-unknown-property': 'error',

      // React 18 + automatic JSX runtime — `import React` is not required for JSX.
      'react/react-in-jsx-scope': 'off',

      // TypeScript handles prop validation better than PropTypes.
      // Disabling this avoids false positives on TypeScript-typed components.
      'react/prop-types': 'off',

      // ── React Hooks rules ────────────────────────────────────────────────────
      // Enforces the Rules of Hooks — hooks must be called at the top level of
      // a React function, never inside loops, conditions, or nested functions.
      'react-hooks/rules-of-hooks': 'error',

      // Every variable used inside useEffect/useCallback/useMemo must be listed
      // in the dependency array — catches stale closure bugs.
      'react-hooks/exhaustive-deps': 'warn',

      // ── React Refresh (HMR) ──────────────────────────────────────────────────
      // Files that export non-component values alongside components disable HMR
      // for that file — the whole page reloads instead of just the component.
      // allowConstantExport: true allows constants (like style objects) to coexist.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // ─── 7. Prettier — MUST be the last config ───────────────────────────────────
  // Disables all ESLint rules that would conflict with Prettier's formatting.
  // This is NOT the eslint-plugin-prettier pattern (which runs Prettier as a rule).
  // The correct separation: ESLint for code quality, Prettier for formatting.
  prettierConfig,
);
