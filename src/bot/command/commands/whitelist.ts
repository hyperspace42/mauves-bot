import { CommandInteraction } from 'discord.js';

export default async function whitelist(interaction: CommandInteraction, username: string): Promise<void> {
  // make request

  const data: string = `${username} есть на сервере, ваш никнейм: {nickname}`;

  interaction.reply(data);
}
