import { bot } from './index';

import getServerStatus from '../utils/getServerStatus'

import { IServerStatus } from 'types';

const formatActivityByPeopleCount = function (peopleCount: number): string {
  const activityString: string = `майнкрафт с ${peopleCount} %people на сервере`;

  const lastDigit: number = +(String(peopleCount).at(-1) as string);

  switch (lastDigit) {
    case 0:
      return 'майнкрафт один :с';
    case 1:
      return activityString.replace('%people', 'человеком');
    default:
      return activityString.replace('%people', 'людьми');
  }
};

export const setBotActivity = async function (): Promise<void> {
  const serverStatus: IServerStatus = await getServerStatus()

  const playersOnline: number = serverStatus.players.online

  if (bot.user) {
    bot.user.setActivity(formatActivityByPeopleCount(playersOnline), { type: "PLAYING" });
  }
};
