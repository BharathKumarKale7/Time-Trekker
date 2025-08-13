import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Globally ignore the 'dist' folder (build output)
  globalIgnores(['dist']),
  {
    // Apply this config to all JS and JSX files
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended, // Base recommended JS rules
      reactHooks.configs['recommended-latest'], // React Hooks plugin recommended rules
      reactRefresh.configs.vite, // React Refresh plugin for Vite (fast refresh)
    ],
    languageOptions: {
      ecmaVersion: 2020, // Support ES2020 syntax
      globals: globals.browser, // Browser global variables like window, document
      parserOptions: {
        ecmaVersion: 'latest', // Latest ECMAScript features
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // Support ES modules
      },
    },
    rules: {
      // Error on unused variables except those starting with uppercase letter or underscore
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
