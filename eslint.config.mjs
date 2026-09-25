import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname, recommendedConfig: js.configs.recommended });

export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  globalIgnores(['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts']),
]);
