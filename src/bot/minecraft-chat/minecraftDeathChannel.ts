import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsMinecraftServerConnetionMessage } from 'types';

import { MessageEmbed, TextChannel } from 'discord.js';
import getDiscordChannelById from '@bot/utils/getDiscordChannelById';

const MINECRAFT_MESSAGES_CHANNEL_ID: string = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID');

const deathReactions: string[] = [
  ':c',
  ':smiling_face_with_tear:',
  ':exploding_head:',
  ':cry:',
  ':rage:',
  ':rofl:',
  ':clown:',
  ':partying_face:',
];

const getRandomDeathReaction = function(): string {
  const index: number = Math.floor(Math.random() * deathReactions.length)

  return deathReactions[index]
}

export default async function sendDeathEmbed(params: INatsMinecraftServerConnetionMessage) {
  const channel = (await getDiscordChannelById(MINECRAFT_MESSAGES_CHANNEL_ID)) as TextChannel | null;

  if (!channel) {
    return;
  }

  const nickname: string = params.player;
  const deathReaction: string = getRandomDeathReaction()

  const joinMessageEmbed: MessageEmbed = new MessageEmbed()
    .setColor('#ff4754')
    .setDescription(`${nickname} умер ${deathReaction}`)
    .setFooter({ text: 'Чат сервера #Mauves' });

  await channel.send({ embeds: [joinMessageEmbed] });
}
