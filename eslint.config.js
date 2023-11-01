// eslint.config.js
import antfu from '@antfu/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react/configs/recommended.js'
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js'

// for more information about this flat config for eslint see: https://github.com/antfu/eslint-config
export default antfu(
  {
    typescript: true, 
    ignores: [
      '!.yarn/',
      '!.vite/',
      '.yarn/*',
      '.vite/*',
      '.pnp.cjs',
      '.pnp.loader.mjs',
      '**/*.config.js',
    ],
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
    },
  },
)
