import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsMinecraftServerConnetionMessage } from 'types';

import { MessageEmbed, TextChannel } from 'discord.js';
import getDiscordChannelById from '@bot/utils/getDiscordChannelById';
import setBotActivity from '@bot/utils/botActivity';

const MINECRAFT_MESSAGES_CHANNEL_ID: string = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID');

export const sendJoinMessageEmbed = async function (params: INatsMinecraftServerConnetionMessage) {
  const channel = (await getDiscordChannelById(MINECRAFT_MESSAGES_CHANNEL_ID)) as TextChannel | null;

  if (!channel) {
    return;
  }

  const nickname: string = params.player;

  setBotActivity();

  const joinMessageEmbed: MessageEmbed = new MessageEmbed()
    .setColor('#ffcd75')
    .setDescription(`${nickname} зашел на сервер!`)
    .setFooter({ text: 'Чат сервера #Mauves' });

  await channel.send({ embeds: [joinMessageEmbed] });
};

export const sendLeaveMessageEmbed = async function (params: INatsMinecraftServerConnetionMessage) {
  const channel = (await getDiscordChannelById(MINECRAFT_MESSAGES_CHANNEL_ID)) as TextChannel | null;

  if (!channel) {
    return;
  }

  const nickname: string = params.player;

  setBotActivity();

  const leaveMessageEmbed: MessageEmbed = new MessageEmbed()
    .setColor('#ffcd75')
    .setDescription(`${nickname} вышел с сервера.`)
    .setFooter({ text: 'Чат сервера #Mauves' });

  await channel.send({ embeds: [leaveMessageEmbed] });
};
