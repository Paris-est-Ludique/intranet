import chalk from 'chalk'
import { addStatus } from '@/server/status'

export default async () => {
  const hasSecret = !!import.meta.env.JWT_SECRET
  const hasDiscordAccess = !!import.meta.env.DISCORD_TOKEN
  const hasGSheetsAccess = !!import.meta.env.GOOGLE_SHEET_ID
  const hasSendGridApiAccess = !!import.meta.env.SENDGRID_API_KEY
  const hasPushNotifAccess = !!import.meta.env.FORCE_ORANGE_PUBLIC_VAPID_KEY

  addStatus(chalk.bgYellow(`hi ${import.meta.env.USERNAME} !`))

  if (hasSendGridApiAccess) {
    addStatus('Emailing:', chalk.green(`✅ online through SendGrid`))
  } else {
    addStatus('Emailing:', chalk.blue(`🚧 offline, simulated`))
  }

  if (hasPushNotifAccess) {
    addStatus('Push notif:', chalk.green(`✅ online with a Vapid key`))
  } else {
    addStatus('Push notif:', chalk.blue(`🚧 offline, simulated`))
  }

  if (hasGSheetsAccess) {
    addStatus('Database:', chalk.green(`✅ online from Google Sheet`))
  } else {
    addStatus('Database:', chalk.blue(`🚧 offline, simulated from local db file`))
  }

  if (hasDiscordAccess) {
    addStatus('Discord bot:', chalk.green(`✅ online through discord.js`))
  } else {
    addStatus('Discord bot:', chalk.blue(`🚧 no creds, disabled`))
  }

  if (hasSecret) {
    addStatus('JWT secret:', chalk.green(`✅ prod private one from file`))
  } else {
    addStatus('JWT secret:', chalk.blue(`🚧 dev public fake one from config`))
  }
}
