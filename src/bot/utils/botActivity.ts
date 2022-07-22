import { bot } from '@bot/index';

import getServerStatus from '@utils/getServerStatus';

import { IServerStatus } from '$types';

export default async function setBotActivity(): Promise<void> {
  try {
    const serverStatus: IServerStatus = await getServerStatus();
    
    const playersOnline: number = serverStatus.players.online;
    
    if (bot.user) {
      bot.user.setActivity(`Онлайн: ${playersOnline}`, { type: 'PLAYING' });
    }
  } catch (error) {
    console.log(error);
  }
}
