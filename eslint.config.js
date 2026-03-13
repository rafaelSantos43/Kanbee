const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals'); // 👈 Necesitas este paquete

module.exports = defineConfig([
  ...expoConfig, // Nota: asegúrate de usar el spread operator (...) si es un array
  {
    files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.test.tsx', 'jest.setup.js'],
    languageOptions: {
      globals: {
        ...globals.jest, // ✨ Esto define describe, it, expect, jest, etc.
      },
    },
  },
  {
    ignores: ['dist/*', 'node_modules/*'],
  },
]);