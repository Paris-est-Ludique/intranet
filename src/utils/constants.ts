export const IS_PROD = import.meta.env.NODE_ENV === 'production'
export const IS_DEV = !IS_PROD
export const IS_SSR = import.meta.env.SSR
