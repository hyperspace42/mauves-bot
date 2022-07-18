import { AnyChannel } from 'discord.js';

import { bot } from '../bot/index';

export default async function getDiscordChannelById(channelId: string): Promise<AnyChannel | undefined> {
  const channel = bot.channels.cache.get(channelId);

  return channel
}