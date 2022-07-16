import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { Client, Intents, Message, MessageEmbed, TextChannel } from 'discord.js';

import commands from './commands';
import getServerStatus from '../utils/getServerStatus';
import getHeadImageLinkByUsername from '../utils/getHeadImageLinkByUsername';
import { INatsChatGlobalMessage, IServerStatus } from 'types';

const prefix: string = '!';
const MINECRAFT_MESSAGES_CHANNEL_ID: string = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID');

const bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

export const sendMessage = async function (channelId: string, message: string) {
  const channel = (await bot.channels.cache.get(channelId)) as TextChannel | null;

  if (!channel) {
    return;
  }

  await channel.send(message);
};

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

const sendStatusEmbed = async function (channelId: string, status: IServerStatus) {
  const channel = (await bot.channels.cache.get(channelId)) as TextChannel | null;

  if (!channel) {
    return;
  }

  let statusEmbed: MessageEmbed;

  if (status.online) {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('Статус сервера')
      .setDescription(status.description.join(''))
      .setThumbnail(bot.user?.avatarURL() as string)
      .addField('Сервер онлайн', 'Да')
      .addField('Айпи', status.ip)
      .addField('Порт', status.port.toString())
      .addField('Игроков онлайн', status.players.online.toString());
  } else {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setThumbnail(bot.user?.avatarURL() as string)
      .setTitle('Статус сервера')
      .addField('Сервер онлайн', 'Нет');
  }

  channel.send({ embeds: [statusEmbed] });
};

const deleteMessageIfItInMinecraftMessagesChannel = function (message: Message): boolean {
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
    if (deleteMessageIfItInMinecraftMessagesChannel(message)) return;
    if (message.content[0] != prefix) return;

    const command: string = message.content.slice(1);

    try {
      switch (command) {
        case commands.status:
          const serverStatus: IServerStatus = await getServerStatus();

          sendStatusEmbed(message.channelId, serverStatus);
      }
    } catch (error) {
      console.log(error);
    }
  });

  bot.login(TOKEN);
};
