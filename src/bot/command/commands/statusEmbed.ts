import { IServerStatus } from '$types';

import { CommandInteraction, MessageEmbed } from 'discord.js';

import { bot } from '@bot/index';

export default async function sendStatusEmbed(interaction: CommandInteraction, status: IServerStatus) {
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

  await interaction.reply({ embeds: [statusEmbed] });
};