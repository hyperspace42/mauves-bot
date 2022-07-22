import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { Message } from 'discord.js';

export default async function deleteMessage(message: Message, channelId: string): Promise<boolean> {
  if (message.channelId === channelId) {
    try {
      await message.delete();
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  return false;
}
