module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules', 'coverage'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    // React 관련
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    
    // TypeScript 관련
    '@typescript-eslint/no-unused-vars': [
      'error', 
      { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // 일반 코드 품질
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'error',
    
    // 스타일 관련 (Prettier와 충돌하지 않는 것들)
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
} 