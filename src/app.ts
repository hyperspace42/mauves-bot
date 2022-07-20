import 'module-alias/register';

import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import { listenChanel } from '@nats-client/index';
import { startBot } from '@bot/index';
import { sendMessageEmbed } from '@bot/nats/minecraftMessagesChannel';
import { sendJoinMessage, sendLeaveMessage } from '@bot/nats/minecraftConnectionChannel';

const BOT_TOKEN: string = nconf.get('BOT_TOKEN');

listenChanel('chat.global', sendMessageEmbed);
listenChanel('chat.join', sendJoinMessage);
listenChanel('chat.leave', sendLeaveMessage);

startBot(BOT_TOKEN);
