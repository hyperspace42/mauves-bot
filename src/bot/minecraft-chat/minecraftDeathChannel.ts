import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsMinecraftServerConnetionMessage } from 'types';

import { WebhookClient } from 'discord.js';

const MINECRAFT_MESSAGES_WEBHOOK_URL: string = nconf.get('MINECRAFT_MESSAGES_WEBHOOK_URL');

const webhookClient: WebhookClient = new WebhookClient({ url: MINECRAFT_MESSAGES_WEBHOOK_URL });

const deathAvatarUrl: string = 'https://cdn.discordapp.com/attachments/999133560785092663/1000077170095423548/death_avatar.png';

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
  const nickname: string = params.player;
  const deathReaction: string = getRandomDeathReaction()

  try {
    await webhookClient.send({
      content: `${nickname} умер ${deathReaction}`,
      username: 'Смерти',
      avatarURL: deathAvatarUrl
    })
  } catch (error) {
    console.log(error);
  }
}
