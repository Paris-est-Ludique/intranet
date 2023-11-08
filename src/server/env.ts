import { loadEnv } from 'vite'

const env = import.meta.env || {}

if (!import.meta.env) {
  const mode = process.import.meta.env.MODE || null

  Object.assign(env, loadEnv(mode, process.cwd(), ''))
}

export default env
