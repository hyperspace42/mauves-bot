import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { Message } from 'discord.js';

const MINECRAFT_MESSAGES_CHANNEL_ID: string = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID');

export default async function deleteMessage(message: Message): Promise<boolean> {
  if (message.channelId === MINECRAFT_MESSAGES_CHANNEL_ID) {
    try {
      await message.delete();
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  return false;
}
