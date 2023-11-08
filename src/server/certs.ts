// Create HTTP and HTTPS server
import * as http from 'node:http'
import * as https from 'node:https'
import * as fs from 'node:fs'
import chalk from 'chalk'
import every from 'lodash/every'
import mapValues from 'lodash/mapValues'
import type { Express } from 'express'
import { addStatus, showStatusAt } from '@/server/status'

interface Cert {
  key: string
  cert: string
}

export default (app: Express) => {
  const servers = [{ protocol: 'http', server: http.createServer(app) }]

  // TODO check for change ceertbot paths
  const certPaths: Cert[] = [
    {
      // Prod
      key: '/root/certbot/config/live/fo.parisestludique.fr/privkey.pem',
      cert: '/root/certbot/config/live/fo.parisestludique.fr/fullchain.pem',
    },
    {
      // Local
      key: '../certbot/key.pem',
      cert: '../certbot/cert.pem',
    },
  ]

  const validCertPath: Cert | undefined = certPaths.find((certPath: Cert) =>
    every(certPath, (pemPath: string) => fs.existsSync(pemPath)),
  )

  if (validCertPath) {
    const httpsOptions = mapValues(validCertPath, (pemPath: string) => fs.readFileSync(pemPath))

    servers.push({ protocol: 'https', server: https.createServer(httpsOptions, app) })

    showStatusAt(6)
  }
  else {
    showStatusAt(5)
  }

  // Listen on provided port, on all network interfaces.
  servers.forEach(({ protocol, server }) => {
    const PORT = import.meta.env.PORT || 3000
    server.listen(protocol === 'http' ? PORT : <number>PORT + 2)
    server.on('error', (error: any) => {
      if (error) {
        addStatus('Server listening:', chalk.red(`==> 😭  OMG!!! ${error}`))
      }
    })
    server.on('listening', () => {
      const addr = server.address()
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      addStatus('Server listening:', chalk.green(`✅ ${bind}`))
    })
  })
}
