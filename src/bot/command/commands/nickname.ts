import { bot } from '@bot/index';

import { CommandInteraction, MessageEmbed } from 'discord.js';

const infoEmbed = function (): MessageEmbed {
  const embed: MessageEmbed = new MessageEmbed()
    .setTitle('Команды связанные с ником на сервере')
    .setColor('ORANGE')
    .setThumbnail(bot.user?.avatarURL() as string)
    .addField('info', 'Отправляет команды связанные с ником на сервере')
    .addField('get', 'Узнать ник на сервере, привязанный к вашему дискорду')
    .addField('set {nickname}', 'Изменить привязанный к вашему дискорду никнейм на сервере');

  return embed;
};

export default async function nickname(interaction: CommandInteraction) {
  try {
    const subcommand: string = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'info':
        const embed: MessageEmbed = infoEmbed();

        interaction.reply({ embeds: [embed] });

        break;
      case 'get':
        interaction.reply('get');

        break;
      case 'set':
        interaction.reply(interaction.options.getString('nickname') as string);

        break;
    }
  } catch (error) {
    console.log(error);
  }
}
