import { bot } from './index';

import getServerStatus from '../utils/getServerStatus';

import { IServerStatus } from 'types';

export const setBotActivity = async function (): Promise<void> {
  const serverStatus: IServerStatus = await getServerStatus();

  const playersOnline: number = serverStatus.players.online;

  if (bot.user) {
    bot.user.setActivity(`Онлайн: ${playersOnline}`, { type: 'PLAYING' });
  }
};
