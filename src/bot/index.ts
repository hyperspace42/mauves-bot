import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsChatGlobalMessage, IServerStatus } from 'types';

import { Client, Intents, Message, MessageEmbed, TextChannel } from 'discord.js';

import getServerStatus from '../utils/getServerStatus';
import getHeadImageLinkByUsername from '../utils/getHeadImageLinkByUsername';
import ServerStatusDto from '../dtos/serverStatusDto'
import PlayersOnlineDto from '../dtos/playersOnlineDto'

const prefix: string = '!';
const MINECRAFT_MESSAGES_CHANNEL_ID: string = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID');

const bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

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

  const statusDto = new ServerStatusDto(status)

  if (status.online) {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('Статус сервера')
      .setDescription(statusDto.description.join(''))
      .setThumbnail(bot.user?.avatarURL() as string)
      .addField('Сервер онлайн', 'Да')
      .addField('Версия', statusDto.version);
  } else {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setThumbnail(bot.user?.avatarURL() as string)
      .setTitle('Статус сервера')
      .addField('Сервер онлайн', 'Нет');
  }

  channel.send({ embeds: [statusEmbed] });
};

const sendOnlinePlayersEmbed = async function (channelId: string, status: IServerStatus) {
  const channel = (await bot.channels.cache.get(channelId)) as TextChannel | null;

  if (!channel) {
    return;
  }

  let statusEmbed: MessageEmbed;

  const playersOnlineDto = new PlayersOnlineDto(status)

  if (status.online) {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('Игроки на сервере')
      .setDescription(playersOnlineDto.description.join(''))
      .setThumbnail(bot.user?.avatarURL() as string)
      .addField('Сейчас на сервере', playersOnlineDto.players.online.toString())

      if (playersOnlineDto.players.list?.length) {
        statusEmbed.addField('Игроки онлайн', playersOnlineDto.players.list.join('\n'))
      }
  } else {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setThumbnail(bot.user?.avatarURL() as string)
      .setTitle('Статус сервера')
      .addField('Сервер онлайн', 'Нет');
  }

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
