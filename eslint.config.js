import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**', 'coverage/**']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      boundaries,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared/**/*' },
        { type: 'entities', pattern: 'src/entities/**/*' },
        { type: 'features', pattern: 'src/features/**/*' },
        { type: 'widgets', pattern: 'src/widgets/**/*' },
        { type: 'views', pattern: 'src/views/**/*' },
        { type: 'app', pattern: 'src/app/**/*' },
      ],
      'boundaries/ignore': ['**/*.test.{ts,tsx}', 'src/test/**/*', 'src/main.tsx'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: { type: 'shared' }, allow: { to: { type: 'shared' } } },
            {
              from: { type: 'entities' },
              allow: { to: { type: ['shared', 'entities'] } },
            },
            {
              from: { type: 'features' },
              allow: { to: { type: ['shared', 'entities'] } },
            },
            {
              from: { type: 'widgets' },
              allow: {
                to: { type: ['shared', 'entities', 'features', 'widgets'] },
              },
            },
            {
              from: { type: 'views' },
              allow: {
                to: { type: ['shared', 'entities', 'features', 'widgets', 'views'] },
              },
            },
            {
              from: { type: 'app' },
              allow: {
                to: {
                  type: ['shared', 'entities', 'features', 'widgets', 'views', 'app'],
                },
              },
            },
          ],
        },
      ],
    },
  },
  {
    files: ['vite.config.ts', 'vitest.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
])
