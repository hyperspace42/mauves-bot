import { IServerStatus } from '$types';

import { CommandInteraction, MessageEmbed } from 'discord.js';

import { bot } from '@bot/index';

export default async function sendOnlinePlayersEmbed(interaction: CommandInteraction, status: IServerStatus) {
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

  await interaction.reply({ embeds: [statusEmbed] });
};
