import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { INatsDeathMessage } from 'types';

import { WebhookClient } from 'discord.js';

import translations from '$translations';

const MINECRAFT_MESSAGES_WEBHOOK_URL: string = nconf.get('MINECRAFT_MESSAGES_WEBHOOK_URL');

const webhookClient: WebhookClient = new WebhookClient({ url: MINECRAFT_MESSAGES_WEBHOOK_URL });

const deathAvatarUrl: string = 'https://cdn.discordapp.com/attachments/999133560785092663/1000740191142686801/death-avatar.png';

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

const getRandomDeathReaction = function (): string {
  const index: number = Math.floor(Math.random() * deathReactions.length);

  return deathReactions[index];
};

const insertValuesInDeathMessageTemplate = function (template: string, args: string[]): string {
  const regex = /%\d\$s/gi;

  const deathMessage = template.replace(regex, function (matched: string) {
    const argIndex: number = +matched[1] - 1

    return args.at(argIndex) as string;
  });

  return deathMessage
};

export default async function sendDeathEmbed(params: INatsDeathMessage) {
  const deathMessageTemplate: string = translations[params.translationKey];

  const deathMessage: string = insertValuesInDeathMessageTemplate(deathMessageTemplate, params.args)

  const deathReaction: string = getRandomDeathReaction();

  try {
    await webhookClient.send({
      content: `${deathMessage} ${deathReaction}`,
      username: 'Смерти',
      avatarURL: deathAvatarUrl
    })
  } catch (error) {
    console.log(error);
  }
}
