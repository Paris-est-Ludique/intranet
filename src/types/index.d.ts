declare const __CLIENT__: boolean
declare const __SERVER__: boolean
declare const __DEV__: boolean
declare const __LOCAL__: boolean
declare const __REGISTER_DISCORD_COMMANDS__: boolean
declare const __TEST__: boolean

declare module '*.svg'
declare module '*.gif'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.webp'
declare module '*.css'
declare module '*.scss'

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

  interface Process {
    readonly env: ImportMetaEnv
  }
}

interface Window {
  __INITIAL_STATE__: Record<string, unknown>
}
