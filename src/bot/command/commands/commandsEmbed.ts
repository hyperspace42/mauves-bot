import { CommandInteraction, MessageEmbed } from "discord.js";

import { bot } from '@bot/index';

const commandsDescriptionList: {
  [key: string]: string;
} = {
  commands: 'Отправляет все команды бота',
  status: 'Отправляет статус сервера',
  players: 'Отправляет список игроков на сервере в данный момент',
  nickname: '[info/get/set] Отправляет комадны для работы с никнеймом',
};

export default async function sendCommandsEmbed(interaction: CommandInteraction): Promise<void> {
  const commandEmbed = new MessageEmbed()
    .setTitle('Команды бота')
    .setColor('AQUA')
    .setThumbnail(bot.user?.avatarURL() as string);

  for (const command in commandsDescriptionList) {
    commandEmbed.addField(`/${command}`, commandsDescriptionList[command]);
  }

  await interaction.reply({ embeds: [commandEmbed] });
};