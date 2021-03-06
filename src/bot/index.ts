import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import dayjs from 'dayjs';

import { Client, Intents, Message } from 'discord.js';

import getServerStatus from '../utils/getServerStatus';
import { sendCommandsEmbed, sendOnlinePlayersEmbed, sendStatusEmbed } from './commands';

import { deleteMessage as deleteMessageFromMinecraftMessagesChannel } from './minecraftMessagesChannel';
import { handleImageChannelMessage } from './imagesChannel';
import { scheduleBotActivity } from './scheduleBotActivity';

const MINECRAFT_MESSAGES_CHANNEL_ID: string = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID');
const IMAGES_CHANNEL_ID: string = nconf.get('IMAGES_CHANNEL_ID');

const excludedChannelsIdsForCommands: string[] = [MINECRAFT_MESSAGES_CHANNEL_ID, IMAGES_CHANNEL_ID];

const prefix: string = '!';

export const bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const logCommandMessage = function (message: Message): void {
  const authorUsername: string = `${message.author.username}#${message.author.discriminator}`;
  const time = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');

  console.log(`${time} [${authorUsername}] ${message.content}`);
};

export const startBot = function (TOKEN: string) {
  bot.once('ready', () => {
    scheduleBotActivity();

    console.log('Bot started');
  });

  bot.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;
    if (deleteMessageFromMinecraftMessagesChannel(message)) return;

    await handleImageChannelMessage(message);

    if (message.content[0] !== prefix) return;

    if (excludedChannelsIdsForCommands.includes(message.channelId)) {
      return;
    }

    logCommandMessage(message);

    const command: string = message.content.slice(1);

    try {
      switch (command) {
        case 'commands':
          sendCommandsEmbed(message.channelId);
          break;
        case 'status':
          sendStatusEmbed(message.channelId, await getServerStatus());
          break;
        case 'players':
          sendOnlinePlayersEmbed(message.channelId, await getServerStatus());
          break;
      }
    } catch (error) {
      console.log(error);
    }
  });

  bot.login(TOKEN);
};
