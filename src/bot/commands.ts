import { IServerStatus } from '../types';

import { MessageEmbed, TextChannel } from 'discord.js';

import { bot } from './index';

const commandsDescriptionList: {
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

  for (const command in commandsDescriptionList) {
    commandEmbed.addField(`!${command}`, commandsDescriptionList[command]);
  }

  await channel.send({ embeds: [commandEmbed] });
};

export const sendStatusEmbed = async function (channelId: string, status: IServerStatus) {
  const channel = bot.channels.cache.get(channelId) as TextChannel | null;

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
      .addField('Версия', status.version);
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

  if (status.online) {
    statusEmbed = new MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('Игроки на сервере')
      .setDescription(status.description.join(''))
      .setThumbnail(bot.user?.avatarURL() as string)
      .addField('Сейчас на сервере', status.players.online.toString());

    if (status.players.list?.length) {
      statusEmbed.addField('Игроки онлайн', status.players.list.join('\n'));
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
