import { IServerStatus } from '../types';

import { MessageEmbed, TextChannel } from 'discord.js';

import PlayersOnlineDto from '../dtos/playersOnlineDto';
import ServerStatusDto from '../dtos/serverStatusDto';

import { bot } from './index';

const commandsListDescription: {
  [key: string]: string;
} = {
  commands: 'Отправляет все команды бота',
  status: 'Отправляет статус сервера',
  players: 'Отправляет список игроков на сервере в данный момент',
};

export const sendCommandsEmbed = async function (channelId: string): Promise<void> {
  const channel = bot.channels.cache.get(channelId) as TextChannel | null;

  if (!channel) {
    return;
  }

  const commandEmbed = new MessageEmbed()
    .setTitle('Команды бота')
    .setColor('BLURPLE')
    .setThumbnail(bot.user?.avatarURL() as string);

  for (const command in commandsListDescription) {
    commandEmbed.addField(`!${command}`, commandsListDescription[command]);
  }

  await channel.send({ embeds: [commandEmbed] });
};

export const sendStatusEmbed = async function (channelId: string, status: IServerStatus) {
  const channel = bot.channels.cache.get(channelId) as TextChannel | null;

  if (!channel) {
    return;
  }

  let statusEmbed: MessageEmbed;

  const statusDto = new ServerStatusDto(status);

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

  await channel.send({ embeds: [statusEmbed] });
};

export const sendOnlinePlayersEmbed = async function (channelId: string, status: IServerStatus) {
  const channel = bot.channels.cache.get(channelId) as TextChannel | null;

  if (!channel) {
    return;
  }

  let statusEmbed: MessageEmbed;

  const playersOnlineDto = new PlayersOnlineDto(status);

  if (status.online) {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('Игроки на сервере')
      .setDescription(playersOnlineDto.description.join(''))
      .setThumbnail(bot.user?.avatarURL() as string)
      .addField('Сейчас на сервере', playersOnlineDto.players.online.toString());

    if (playersOnlineDto.players.list?.length) {
      statusEmbed.addField('Игроки онлайн', playersOnlineDto.players.list.join('\n'));
    }
  } else {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setThumbnail(bot.user?.avatarURL() as string)
      .setTitle('Статус сервера')
      .addField('Сервер онлайн', 'Нет');
  }

  await channel.send({ embeds: [statusEmbed] });
};
