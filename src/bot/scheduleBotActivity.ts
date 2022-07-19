import { setBotActivity } from './botActivity'

const fiveMinutes: number = 1000 * 60 * 5

export const scheduleBotActivity = function(): void {
  setBotActivity()

  setInterval(setBotActivity, fiveMinutes)
}