import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsChatGlobalMessage } from 'types';

import { Client, Intents, Message, MessageEmbed, TextChannel } from 'discord.js';

import getServerStatus from '../utils/getServerStatus';
import getHeadImageLinkByUsername from '../utils/getHeadImageLinkByUsername';

import { logCommandMessage, sendOnlinePlayersEmbed, sendStatusEmbed } from './commandsFunctions';

const prefix: string = '!';
const MINECRAFT_MESSAGES_CHANNEL_ID: string = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID');

export const bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

export const sendMinecraftMessageEmbed = async function (params: INatsChatGlobalMessage) {
  const channel = (await bot.channels.cache.get(MINECRAFT_MESSAGES_CHANNEL_ID)) as TextChannel | null;

  if (!channel) {
    return;
  }

  const minecraftHeadImageLink: string = await getHeadImageLinkByUsername(params.sender);

  const statusEmbed: MessageEmbed = new MessageEmbed()
    .setColor('#7d52ff')
    .setTitle(params.sender)
    .setDescription(params.message)
    .setThumbnail(minecraftHeadImageLink)
    .setFooter({ text: 'Чат сервера Mauves' });

  channel.send({ embeds: [statusEmbed] });
};

const deleteMessageInMinecraftMessagesChannel = function (message: Message): boolean {
  if (message.channelId === MINECRAFT_MESSAGES_CHANNEL_ID) {
    message.delete();
    return true;
  }

  return false;
};

export const startBot = function (TOKEN: string) {
  bot.once('ready', () => {
    console.log('Bot started');
  });

  bot.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;
    if (deleteMessageInMinecraftMessagesChannel(message)) return;
    if (message.content[0] != prefix) return;

    logCommandMessage(message)

    const command: string = message.content.slice(1);

    try {
      switch (command) {
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
