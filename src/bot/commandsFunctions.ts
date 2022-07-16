import { IServerStatus } from '../types';

import { Message, MessageEmbed, TextChannel } from 'discord.js';

import dayjs from 'dayjs'

import PlayersOnlineDto from '../dtos/playersOnlineDto';
import ServerStatusDto from '../dtos/serverStatusDto';

import { bot } from './index'

export const logCommandMessage = function(message: Message): void {
  const authorUsername: string = `${message.author.username}#${message.author.discriminator}`
  const time = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]')

  console.log(`${time} [${authorUsername}] ${message.content}`);
}

export const sendStatusEmbed = async function (channelId: string, status: IServerStatus) {
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

export const sendOnlinePlayersEmbed = async function (channelId: string, status: IServerStatus) {
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