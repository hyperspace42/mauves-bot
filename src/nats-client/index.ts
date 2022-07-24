import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);
nconf.defaults({
  NATS_SERVER_URL: '0.0.0.0:4222',
});

import { connect, NatsConnection, StringCodec, Subscription } from 'nats';

const NATS_SERVER_URL: string = nconf.get('NATS_SERVER_URL');
const NATS_TOKEN: string = nconf.get('NATS_TOKEN');

const stringCodec = StringCodec();

// #region functions

const connectToNats = async function (): Promise<NatsConnection> {
  const natsConnetion: Promise<NatsConnection> = connect({
    servers: NATS_SERVER_URL,
    token: NATS_TOKEN,
  });

  console.log(`[nats] Connected to nats server ${NATS_SERVER_URL}`);

  return natsConnetion;
};

const subscribeToChannel = async function(connectionPromise: Promise<NatsConnection>, channelName: string): Promise<Subscription> {
  const natsConnetion: NatsConnection = await connectionPromise;
  const sub: Subscription = await natsConnetion.subscribe(channelName);

  console.log(`[nats] Subscribed on ${channelName}`);

  return sub;
}

// #endregion

const natsConnetionPromise: Promise<NatsConnection> = connectToNats();

export default async function listenChannel(channelName: string, handler: Function): Promise<void> {
  try {
    const subPromise: Promise<Subscription> = subscribeToChannel(natsConnetionPromise, channelName);
    const sub = await subPromise;

    for await (const encodedMsg of sub) {
      try {
        const decodedMsg: string = stringCodec.decode(encodedMsg.data);
        const msg = JSON.parse(decodedMsg);

        handler(msg);
      } catch (error) {
        console.log(error);
      }
    }

    (await natsConnetionPromise).drain();
  } catch (error) {
    console.log(error);
  }
};