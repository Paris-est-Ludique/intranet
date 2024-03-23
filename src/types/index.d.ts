declare const __CLIENT__: boolean
declare const __SERVER__: boolean
declare const __DEV__: boolean
declare const __LOCAL__: boolean
declare const __REGISTER_DISCORD_COMMANDS__: boolean
declare const __TEST__: boolean

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
        __CLIENT__: boolean
        __SERVER__: boolean
        __DEV__: boolean
        __LOCAL__: boolean
        __REGISTER_DISCORD_COMMANDS__: boolean
        __TEST__: boolean
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
