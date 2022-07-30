import { CommandInteraction } from 'discord.js';

import getServerStatus from '@utils/getServerStatus';

import sendCommandsEmbed from './commands/commandsEmbed';
import sendStatusEmbed from './commands/statusEmbed';
import sendOnlinePlayersEmbed from './commands/onlinePlayersEmbed';
import nickname from './commands/nickname';
import whitelist from './commands/whitelist';

export default async function handleCommand(command: string, interaction: CommandInteraction): Promise<void> {
  try {
    switch (command) {
      case 'commands':
        await sendCommandsEmbed(interaction);
        break;
      case 'status':
        await sendStatusEmbed(interaction, await getServerStatus());
        break;
      case 'players':
        await sendOnlinePlayersEmbed(interaction, await getServerStatus());
        break;
      case 'nickname':
        await nickname(interaction);
        break;
      case 'whitelist':
        const username: string = `${interaction.user.username}#${interaction.user.discriminator}`;

        await whitelist(interaction, username);
        break;
    }
  } catch (error) {
    console.log(error);
  }
}
