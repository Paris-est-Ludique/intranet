// vite.config.js
/// <reference types="vitest" />

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'vitest/config'
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

function baseConfig(env) {
  return {
    cacheDir: '.vite',
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, './src')}/`,
      },
    },
    build: {
      sourcemap: env.NODE_ENV === 'development' ? 'inline' : false,
      ssrManifest: true,
      cssCodeSplit: true,
    },
    optimizeDeps: { exclude: ['fsevents'] },
    plugins: [
      react(),
      LightningCSS(),
    ],
    test,
  }
}

export function serverConfig(env: Record<string, string>) {
  return {
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
  }
}

export function clientConfig(env: Record<string, string>) {
  return {
    ...baseConfig(env),
  }
}

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')

  return serverConfig(env)
})
