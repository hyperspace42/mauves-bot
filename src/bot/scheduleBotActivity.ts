import { CronJob } from 'cron'

import { setBotActivity } from './botActivity'

export const scheduleBotActivity = function(): void {
  const job = new CronJob('0 5 * * * *', function() {
    setBotActivity()
  })

  setBotActivity()

  job.start()
}