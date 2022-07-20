import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsChatGlobalMessage } from 'types';

import { Message, MessageEmbed, TextChannel } from 'discord.js';
import getHeadImageLinkByUsername from '@utils/getHeadImageLinkByUsername';
import getDiscordChannelById from '@bot/utils/getDiscordChannelById';

const MINECRAFT_MESSAGES_CHANNEL_ID: string = nconf.get('MINECRAFT_MESSAGES_CHANNEL_ID');

export const sendMessageEmbed = async function (params: INatsChatGlobalMessage) {
  const channel = await getDiscordChannelById(MINECRAFT_MESSAGES_CHANNEL_ID) as TextChannel | null;

  if (!channel) {
    return;
  }

  const minecraftHeadImageLink: string = await getHeadImageLinkByUsername(params.sender);

  const minecraftMessageEmbed: MessageEmbed = new MessageEmbed()
    .setColor('#7d52ff')
    .setTitle(params.sender)
    .setDescription(params.message)
    .setThumbnail(minecraftHeadImageLink)
    .setFooter({ text: 'Чат сервера #Mauves' });

  await channel.send({ embeds: [minecraftMessageEmbed] });
};

export const deleteMessage = function (message: Message): boolean {
  if (message.channelId === MINECRAFT_MESSAGES_CHANNEL_ID) {
    message.delete();
    return true;
  }

  return false;
};
