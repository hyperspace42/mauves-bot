import { IServerStatus } from '$types';

import { MessageEmbed, TextChannel, CommandInteraction } from 'discord.js';

import getDiscordChannelById from '@bot/utils/getDiscordChannelById';
import getServerStatus from '@utils/getServerStatus';

import { bot } from '@bot/index';

const commandsDescriptionList: {
  [key: string]: string;
} = {
  commands: 'Отправляет все команды бота',
  status: 'Отправляет статус сервера',
  players: 'Отправляет список игроков на сервере в данный момент',
};

const sendCommandsEmbed = async function (interaction: CommandInteraction): Promise<void> {
  const commandEmbed = new MessageEmbed()
    .setTitle('Команды бота')
    .setColor('BLURPLE')
    .setThumbnail(bot.user?.avatarURL() as string);

  for (const command in commandsDescriptionList) {
    commandEmbed.addField(`!${command}`, commandsDescriptionList[command]);
  }

  await interaction.reply({ embeds: [commandEmbed] });
};

const sendStatusEmbed = async function (interaction: CommandInteraction, status: IServerStatus) {
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

const sendOnlinePlayersEmbed = async function (interaction: CommandInteraction, status: IServerStatus) {
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

export default async function handleCommand(command: string, interaction: CommandInteraction): Promise<void> {
  try {
    switch (command) {
      case 'commands':
        sendCommandsEmbed(interaction);
        break;
      case 'status':
        sendStatusEmbed(interaction, await getServerStatus());
        break;
      case 'players':
        sendOnlinePlayersEmbed(interaction, await getServerStatus());
        break;
    }
  } catch (error) {
    console.log(error);
  }
}
