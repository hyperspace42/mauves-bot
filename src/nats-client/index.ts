import nconf from "nconf";

nconf.file(`${process.cwd()}/config.json`);
nconf.defaults({
  NATS_SERVER_URL: "0.0.0.0:4222",
});

import { INatsChatGlobalMessage } from "../types";

import { connect, NatsConnection, StringCodec, Subscription } from "nats";

import { sendMessageEmbed } from "../bot/minecraftMessagesChannel";

const NATS_SERVER_URL: string = nconf.get("NATS_SERVER_URL");
const NATS_TOKEN: string = nconf.get("NATS_TOKEN");

const stringCodec = StringCodec();

// #region functions

const connectToNats = async function (): Promise<NatsConnection> {
  const natsConnetion: Promise<NatsConnection> = connect({
    servers: NATS_SERVER_URL,
    token: NATS_TOKEN,
  });

  console.log(`Connected to nats server ${NATS_SERVER_URL}`);

  return natsConnetion;
};

const subscribeToChatGlobal = async function (
  connectionPromise: Promise<NatsConnection>
): Promise<Subscription> {
  const natsConnetion: NatsConnection = await connectionPromise;
  const sub: Subscription = await natsConnetion.subscribe("chat.global");

  console.log("Subscribed on chat.global");

  return sub;
};

// #endregio

export const listenChatGlobal = async function (): Promise<void> {
  try {
    const natsConnetionPromise: Promise<NatsConnection> = connectToNats();
    const subPromise: Promise<Subscription> =
      subscribeToChatGlobal(natsConnetionPromise);

    const sub = await subPromise;

    for await (const encodedMsg of sub) {
      try {
        const decodedMsg: string = stringCodec.decode(encodedMsg.data);
        const msg: INatsChatGlobalMessage = JSON.parse(decodedMsg);

        sendMessageEmbed(msg);
      } catch (error) {
        console.log(error);
      }
    }

    (await natsConnetionPromise).drain();
  } catch (error) {
    console.log(error);
  }
};
