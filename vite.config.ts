// vite.config.js
/// <reference types="vitest" />

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {browserslistToTargets} from 'lightningcss'
import browserslist from 'browserslist'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const test = {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['vitest/vitest.setup.ts'],
  threads: false,
  watch: false,
} as UserConfig['test']

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: '.vite',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%'))
    }
  },
  build: {
    cssMinify: 'lightningcss',
    sourcemap: process.env.DEV === 'true' ? 'inline' : false,
    cssCodeSplit: true,
  },
  optimizeDeps: { exclude: ['fsevents'] },
  plugins: [
    react(),
    AutoImport({
      dts: './src/auto-import.d.ts',
      defaultExportByFilename: false,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      dirs: [
        './src/hooks/**/*',
        './src/components/**/*',
        './src/services/**/*',
        './src/store/**/*',
        './src/utils/**/*',
      ],
      imports: [
        'react',
        'react-router',
      ],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
  ],
  build: {
    minify: false,
  },
  optimizeDeps: { exclude: ['fsevents'] },
  test,
})
