import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsMinecraftServerConnetionMessage } from 'types';

import { TextChannel } from 'discord.js';
import getDiscordChannelById from '@bot/utils/getDiscordChannelById';
import setBotActivity from '@bot/utils/botActivity';

const MINECRAFT_SERVER_CONNECTION_CHANNEL_ID: string = nconf.get('MINECRAFT_SERVER_CONNECTION_CHANNEL_ID');

export const sendJoinMessage = async function (params: INatsMinecraftServerConnetionMessage) {
  const channel = (await getDiscordChannelById(MINECRAFT_SERVER_CONNECTION_CHANNEL_ID)) as TextChannel | null;

  if (!channel) {
    return;
  }

  const nickname: string = params.player;

  setBotActivity();

  await channel.send(`${nickname} зашел на сервер!`);
};

export const sendLeaveMessage = async function (params: INatsMinecraftServerConnetionMessage) {
  const channel = (await getDiscordChannelById(MINECRAFT_SERVER_CONNECTION_CHANNEL_ID)) as TextChannel | null;

  if (!channel) {
    return;
  }

  const nickname: string = params.player;

  setBotActivity();

  await channel.send(`${nickname} вышел с сервера.`);
};
