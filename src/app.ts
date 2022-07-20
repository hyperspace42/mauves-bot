import 'module-alias/register';

import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import listenChannel from '@nats-client/index';
import { startBot } from '@bot/index';
import { sendMessageEmbed } from '@bot/nats/minecraftMessagesChannel';
import { sendJoinMessage, sendLeaveMessage } from '@bot/nats/minecraftConnectionChannel';

const BOT_TOKEN: string = nconf.get('BOT_TOKEN');

listenChannel('chat.global', sendMessageEmbed);
listenChannel('chat.join', sendJoinMessage);
listenChannel('chat.leave', sendLeaveMessage);

startBot(BOT_TOKEN);
