declare const API_URL: string
declare const SSR: boolean
declare const DEV: boolean
declare const REGISTER_DISCORD_COMMANDS: boolean
declare const TEST: boolean

declare module "*.svg"
declare module "*.gif"
declare module "*.png"
declare module "*.jpg"
declare module "*.jpeg"
declare module "*.webp"
declare module "*.css"
declare module "*.scss"

declare namespace NodeJS {
    interface Global {
        API_URL: string
        SSR: boolean
        DEV: boolean
        REGISTER_DISCORD_COMMANDS: boolean
        TEST: boolean
        $RefreshReg$: () => void
        $RefreshSig$$: () => void
    }

    interface ProcessEnv {
        SENDGRID_API_KEY?: string
        FORCE_ORANGE_PUBLIC_VAPID_KEY?: string
        FORCE_ORANGE_PRIVATE_VAPID_KEY?: string
        GCP_SERVICE_ACCOUNT_PRIVATE_KEY?: string
        GCP_SERVICE_ACCOUNT_CLIENT_EMAIL?: string
        GSHEET_ID?: string
    }
}

interface Window {
    __INITIAL_STATE__: Record<string, unknown>
}
