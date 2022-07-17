import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);
nconf.defaults({
  NATS_SERVER_URL: '0.0.0.0:4222',
});

import { INatsChatGlobalMessage } from '../types';

import { connect, StringCodec, NatsConnection, Subscription } from 'nats';

import { sendMessageEmbed } from '../bot/minecraftMessagesChannel';

const NATS_SERVER_URL: string = nconf.get('NATS_SERVER_URL');

const stringCodec = StringCodec();

// #region functions

const connectToNats = async function (): Promise<NatsConnection> {
  const natsConnetion: Promise<NatsConnection> = connect({ servers: NATS_SERVER_URL });

  console.log(`Connected to nats server ${NATS_SERVER_URL}`);

  return natsConnetion;
};

const subscribeToChatGlobal = async function (connectionPromise: Promise<NatsConnection>): Promise<Subscription> {
  const natsConnetion: NatsConnection = await connectionPromise;
  const sub: Subscription = await natsConnetion.subscribe('chat.global');

  console.log('Subscribed on chat.global');

  return sub;
};

const parseJsonFromMessage = function (message: string): INatsChatGlobalMessage {
  const splittedMessage: string[] = message.split(' ');

  const senderName: string = splittedMessage[1].slice(0, splittedMessage[1].length - 1);
  const messageText: string = message.slice(message.indexOf('"') + 1, message.length - 2);

  const messageJson: INatsChatGlobalMessage = {
    sender: senderName,
    message: messageText,
  };

  return messageJson;
};

// #endregion

const natsConnetionPromise: Promise<NatsConnection> = connectToNats();
const subPromise: Promise<Subscription> = subscribeToChatGlobal(natsConnetionPromise);

export const listenChatGlobal = async function (): Promise<void> {
  const sub = await subPromise;

  for await (const encodedMsg of sub) {
    const decodedMsg: string = stringCodec.decode(encodedMsg.data);
    const msg: INatsChatGlobalMessage = parseJsonFromMessage(decodedMsg);

    sendMessageEmbed(msg);
  }

  (await natsConnetionPromise).drain();
};
