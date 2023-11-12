// eslint.config.js
import antfu from '@antfu/eslint-config'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react/configs/recommended.js'
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js'

// for more information about this flat config for eslint see: https://github.com/antfu/eslint-config

export default antfu(
  {
    typescript: true,
    ignores: ['!.yarn/', '!.vite/', '.yarn/*', '.vite/*', '.pnp.cjs', '.pnp.loader.mjs', '**/*.config.js', 'dist'],
    plugins: {
      reactRefresh,
    },
  },
  react,
  reactJsx,
  eslintConfigPrettier,
  {
    rules: {
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      'react/no-unescaped-entities': 'off',
      'no-console': 'warn',
      'style/lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          afterBlockComment: true,
          beforeLineComment: true,
          afterLineComment: true,
          allowBlockStart: true,
          allowBlockEnd: true,
          allowObjectStart: true,
          allowObjectEnd: true,
          allowArrayStart: true,
          allowArrayEnd: true,
        },
      ],
      'curly': ['error', 'all'],
      'no-unexpected-multiline': 'error',
      'style/brace-style': ['error', '1tbs'],
      'style/block-spacing': ['error', 'always'],
      'style/no-mixed-operators': 'error',
      'style/no-tabs': ['error', { allowIndentationTabs: true }],
      'style/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
      ],
    },
  },
)
