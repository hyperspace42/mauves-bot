import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { Message, MessageAttachment, MessageEmbed, TextChannel, Collection } from 'discord.js';

import getDiscordChannelById from '../utils/getDiscordChannelById';

const IMAGES_CHANNEL_ID: string = nconf.get('IMAGES_CHANNEL_ID');
const TRASH_IMAGES_CHANNEL_ID: string = nconf.get('TRASH_IMAGES_CHANNEL_ID');

interface IMessageData {
  authorUsername: string;
  authorAvatarUrl: string;
  messageText: string;
}

const getAttachedImagesUrls = function (attachments: Collection<string, MessageAttachment>): string[] {
  const attachedImagesUrls: string[] = attachments
    .filter((att) => {
      if (att.contentType?.includes('image')) {
        return true;
      }

      return false;
    })
    .map((att) => att.url);

  return attachedImagesUrls;
};

const getMessageData = function (message: Message): IMessageData {
  const authorUsername: string = message.author.username;
  const authorAvatarUrl: string = message.author.avatarURL() as string;
  const messageText: string = message.content;

  return { authorUsername, authorAvatarUrl, messageText };
};
const sendImageEmbedMessage = async function (
  channel: TextChannel,
  trashChannel: TextChannel,
  attachedImagesUrls: string[],
  messageData: IMessageData
): Promise<Message> {
  const imageEmbed: MessageEmbed = new MessageEmbed()
    .setAuthor({
      name: messageData.authorUsername,
      iconURL: messageData.authorAvatarUrl,
    })
    .setDescription(messageData.messageText)
    .setImage(attachedImagesUrls[0]);

  trashChannel.send(attachedImagesUrls[0])

  const imageEmbedMessage: Message = await channel.send({ embeds: [imageEmbed] });

  return imageEmbedMessage;
};

export const handleImageChannelMessage = async function (message: Message): Promise<void> {
  const channel = (await getDiscordChannelById(IMAGES_CHANNEL_ID)) as TextChannel | null;
  const trashChannel = (await getDiscordChannelById(TRASH_IMAGES_CHANNEL_ID)) as TextChannel | null;

  if (!channel || !trashChannel || message.channelId !== IMAGES_CHANNEL_ID) {
    return;
  }

  const attachedImagesUrls: string[] = getAttachedImagesUrls(message.attachments);

  if (!attachedImagesUrls.length) {
    await message.delete();
    return;
  }

  const messageData: IMessageData = getMessageData(message);

  const imageEmbedMessage: Message = await sendImageEmbedMessage(channel, trashChannel, attachedImagesUrls, messageData);

  imageEmbedMessage.react('💜');

  imageEmbedMessage.startThread({
    name: '💬 Комментарии',
    autoArchiveDuration: 4320,
  });

  await message.delete();
};
