import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsChatGlobalMessage } from 'types';

import { WebhookClient } from 'discord.js';
import getHeadImageLinkByUsername from '@utils/getHeadImageLinkByUsername';

const MINECRAFT_MESSAGES_WEBHOOK_URL: string = nconf.get('MINECRAFT_MESSAGES_WEBHOOK_URL');

const webhookClient: WebhookClient = new WebhookClient({ url: MINECRAFT_MESSAGES_WEBHOOK_URL });

export default async function sendMessageEmbed(params: INatsChatGlobalMessage) {
  try {
    const minecraftHeadImageLink: string = await getHeadImageLinkByUsername(params.sender);

    await webhookClient.send({
      content: params.message,
      username: params.sender,
      avatarURL: minecraftHeadImageLink,
    });
  } catch (error) {
    console.log(error);
  }
}
