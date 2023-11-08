import checks from '@/server/checks'
import { initNotification } from '@/server/notifications'

export default function initServer() {
  /// Notifications
  initNotification()

  /// Discord Bot
  // discordRegisterCommands()

  /// Commented for dev purposes TODO: uncomment
  // discordBot()

  /// Checks
  checks()

  // TODO see to add cert.ts somewhere with correct env variables
}
