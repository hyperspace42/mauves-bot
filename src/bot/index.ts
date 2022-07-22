import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import dayjs from 'dayjs';

import '@bot/commands/deployCommands'

import { Client, Intents, CommandInteraction, Message } from 'discord.js';

import handleCommand from '@bot/commands/commands';

import deleteChatMessage from '@bot/minecraft-chat/deleteMessage';
import handleImageChannelMessage from '@bot/handlers/imagesChannel';
import setBotActivity from '@bot/utils/botActivity';

const MINECRAFT_MESSAGES_CHANNEL_ID = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID')

export const bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const logCommandMessage = function (interaction: CommandInteraction): void {
  const { user, commandName } = interaction;

  const authorUsername: string = `${user.username}#${user.discriminator}`;
  const time = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');

  console.log(`${time} [${authorUsername}] ${commandName}`);
};

export const startBot = function (TOKEN: string) {
  bot.once('ready', () => {
    setBotActivity();

    console.log('[~] Bot started');
  });

  bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const { commandName } = interaction;

    logCommandMessage(interaction)
    
    await handleCommand(commandName, interaction)
  });

  bot.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;
    if (await deleteChatMessage(message, MINECRAFT_MESSAGES_CHANNEL_ID)) return;

    await handleImageChannelMessage(message);
  });

  bot.login(TOKEN);
};
