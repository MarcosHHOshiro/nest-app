const tseslint = require('typescript-eslint')
const eslint = require('@eslint/js')

module.exports = [
  {
    ignores: [
      'eslint.config.js',
      '.eslintrc.*',
      'dist/**',
      'node_modules/**',
      'generated/**',
      'src/generated/**',
      'prisma/migrations/**',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'off', // permite require no config
      'no-undef': 'off', // evita "module/require is not defined" no config
    },
  },
]
