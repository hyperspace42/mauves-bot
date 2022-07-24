import { CommandInteraction } from 'discord.js';

import getServerStatus from '@utils/getServerStatus';

import sendCommandsEmbed from './commands/commandsEmbed';
import sendStatusEmbed from './commands/statusEmbed';
import sendOnlinePlayersEmbed from './commands/onlinePlayersEmbed';
import nickname from './commands/nickname';

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
      case 'nickname':
        nickname(interaction);
        break;
    }
  } catch (error) {
    console.log(error);
  }
}
