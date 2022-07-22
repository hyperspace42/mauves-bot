import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { REST } from '@discordjs/rest';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v10';

const BOT_TOKEN: string = nconf.get('BOT_TOKEN');
const CLIENT_ID: string = nconf.get('CLIENT_ID');
const GUILD_ID: string = nconf.get('GUILD_ID');

const commands = [
  new SlashCommandBuilder().setName('commands').setDescription('Отправляет все команды бота'),
  new SlashCommandBuilder().setName('status').setDescription('Отправляет статус сервера'),
  new SlashCommandBuilder().setName('players').setDescription('Отправляет список игроков на сервере в данный момент'),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);