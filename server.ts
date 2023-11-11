import fs from 'node:fs'
import path from 'node:path'
import { Writable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import hpp from 'hpp'
import serveStatic from 'serve-static'
import cookieParser from 'cookie-parser'
import { type ViteDevServer, createServer as createViteServer } from 'vite'
import type { Request, Response } from 'express'

import certbot from '@/server/certbot'
import api from '@/server/api.js'
import init from '@/server/init'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isTest = import.meta.env.VITEST

export async function createServer(
  root: string | undefined = process.cwd(),
  isProd: boolean = import.meta.env.PROD,
  hmrPort?: number,
): Promise<{ app: express.Express; vite: ViteDevServer | null }> {
  const resolve = (p: string) => path.resolve(__dirname, p)
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''
  const app = express()

  // Allow receiving big images

  app.use(express.json({ limit: '200mb' }))
  app.use(express.urlencoded({ limit: '200mb' }))
  app.use(express.json())

  app.use(cookieParser())
  app.use(api())

  let vite: ViteDevServer

  if (!isProd) {
    // DEV mode

    vite = await createViteServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency

          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
      optimizeDeps: { include: [] },
    })

    // use vite's connect instance as middleware

    app.use(vite.middlewares)
  } else {
    // PROD mode

    app.use(certbot())
    app.use(helmet({ contentSecurityPolicy: false }))
    app.use(hpp())
    app.use(compression())
    app.use(
      serveStatic(resolve('dist/client'), {
        index: false,
      }),
    )
  }

  app.use('*', async (req, res) => {
    try {
      let template: string
      let render: (request: Request, response: Response, context: object, stream: NodeJS.WritableStream) => any

      const url = req.originalUrl

      if (!isProd) {
        // always read fresh template in dev

        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = indexProd

        // @ts-expect-error missing file

        render = (await import('./dist/server/entry-server.js')).render
      }

      const context: MyContext = {}
      const templateSplit = template.split('<!--app-html-->')
      const stream = new Writable({
        write(chunk, _encoding, cb) {
          res.write(chunk, cb)
        },
        final() {
          res.end(templateSplit[1])
        },
      })

      res.write(templateSplit[0])
      await render(req, res, context, stream)

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        // TODO redirect can cause problems with node stream, need to check how to configure it

        return res.redirect(301, context.url)
      }
    } catch (e: any) {
      vite?.ssrFixStacktrace(e)
      console.error(e.stack)

      return res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

if (!isTest) {
  const port = import.meta.env.PORT || 3001

  createServer().then(({ app }) => {
    return app.listen(port, () => {
      init()
      console.log('')
      console.log('app running on:', chalk.underline(`http://localhost:${port}`))
    })
  })
}
