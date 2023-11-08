/// <reference types="vite/client" />

import type { StaticContext } from 'react-router'

interface ImportMetaEnv {
  readonly PORT?: number
  readonly HOST?: string
  readonly VITE_API_URL?: string
  readonly VITE_GOOGLE_SHEET_ID?: string
  readonly JWT_SECRET?: string
  readonly DISCORD_TOKEN?: string
  readonly SENDGRID_API_KEY?: string
  readonly FORCE_ORANGE_PUBLIC_VAPID_KEY?: string
  readonly FORCE_ORANGE_PRIVATE_VAPID_KEY?: string
}

interface ImportMeta {
  env: ImportMetaEnv
}

export {}
declare global {
  interface MyContext extends StaticContext {
    url?: string
  }
}
