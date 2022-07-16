import path from 'path'

import nconf from 'nconf';

import { startBot } from './bot/index'
import { listenChatGlobal } from './nats-client/index'

nconf.file(`${process.cwd()}/config.json`);

const BOT_TOKEN: string = nconf.get('BOT_TOKEN');

startBot(BOT_TOKEN)
listenChatGlobal()
