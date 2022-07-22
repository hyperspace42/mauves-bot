import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsMinecraftServerConnetionMessage } from 'types';

import { WebhookClient } from 'discord.js';
import setBotActivity from '@bot/utils/botActivity';

const MINECRAFT_MESSAGES_WEBHOOK_URL: string = nconf.get('MINECRAFT_MESSAGES_WEBHOOK_URL');

const webhookClient: WebhookClient = new WebhookClient({ url: MINECRAFT_MESSAGES_WEBHOOK_URL });

const connectionAvatarUrl: string = 'https://cdn.discordapp.com/attachments/999133560785092663/1000076297898315816/connections_avatar.png';

export const sendJoinMessageEmbed = async function (params: INatsMinecraftServerConnetionMessage) {
  const nickname: string = params.player;

  setBotActivity();

  try {
    await webhookClient.send({
      content: `${nickname} зашел на сервер!`,
      username: 'Подключения',
      avatarURL: connectionAvatarUrl,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendLeaveMessageEmbed = async function (params: INatsMinecraftServerConnetionMessage) {
  const nickname: string = params.player;

  setBotActivity();

  try {
    await webhookClient.send({
      content: `${nickname} вышел с сервера.`,
      username: 'Подключения',
      avatarURL: connectionAvatarUrl,
    });
  } catch (error) {
    console.log(error);
  }
};
