// vite.config.js
/// <reference types="vitest" />

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'
import LightningCSS from 'unplugin-lightningcss/vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const test = {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['vitest/vitest.setup.ts'],
  threads: false,
  watch: false,
} as UserConfig['test']

const baseConfig = (env) => ({
  cacheDir: '.vite',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
    },
  },
  build: {
    sourcemap: env.NODE_ENV === 'development' ? 'inline' : false,
    cssCodeSplit: true,
  },
  optimizeDeps: { exclude: ['fsevents', 'lodash/pick'] },
  plugins: [
    react(),
    LightningCSS(),
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
  test,
})

export const serverConfig = (env: Record<string, string>) => ({
  ...baseConfig(env),
  define: {
    'import.meta.env.USERNAME': JSON.stringify(env.LOGNAME),
    'import.meta.env.PORT': JSON.stringify(env.PORT),
    'import.meta.env.HOST': JSON.stringify(env.HOST),
    'import.meta.env.JWT_SECRET': JSON.stringify(env.JWT_SECRET),
    'import.meta.env.DISCORD_TOKEN': JSON.stringify(env.DISCORD_TOKEN),
    'import.meta.env.DISCORD_GUILD_ID': JSON.stringify(env.DISCORD_GUILD_ID),
    'import.meta.env.SENDGRID_API_KEY': JSON.stringify(env.SENDGRID_API_KEY),
    'import.meta.env.FORCE_ORANGE_PUBLIC_VAPID_KEY': JSON.stringify(env.FORCE_ORANGE_PUBLIC_VAPID_KEY),
    'import.meta.env.FORCE_ORANGE_PRIVATE_VAPID_KEY': JSON.stringify(env.FORCE_ORANGE_PRIVATE_VAPID_KEY),
  },
})

export const clientConfig = (env: Record<string, string>) =>  ({
  ...baseConfig(env),
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')

  return serverConfig(env)
})
