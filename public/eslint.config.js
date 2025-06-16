import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        ignores: ['node_modules', 'dist', 'eslint.config.js', './app/assets/js/**'],
    },
    {
        plugins: {
            js,
            prettier: eslintPluginPrettier,
            '@typescript-eslint': tseslint.plugin,
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    // Рекомендованные правила
    js.configs.recommended,
    ...tseslint.configs.recommended,
    // TS/TSX правила
    {
        files: ['app/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.es2024,
            },
            parserOptions: {
                project: ['tsconfig.json'],
            },
        },
        rules: {
            ...eslintPluginPrettier.configs.recommended.rules,
            ...eslintConfigPrettier.rules,
            'array-element-newline': ['error', 'consistent'],
            'prefer-const': 'error',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
        },
    },
]);
