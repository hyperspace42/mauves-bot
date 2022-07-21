import 'module-alias/register';

import nconf from 'nconf';

nconf.file(`${process.cwd()}/config.json`);

import listenChannel from '@nats-client/index';
import { startBot } from '@bot/index';
import { sendJoinMessageEmbed, sendLeaveMessageEmbed } from '@bot/minecraft-chat/minecraftConnectionChannel';
import sendChatMessageEmbed from '@bot/minecraft-chat/minecraftMessagesChannel';
import sendDeathMessageEmbed from '@bot/minecraft-chat/minecraftDeathChannel';

const BOT_TOKEN: string = nconf.get('BOT_TOKEN');

listenChannel('chat.global', sendChatMessageEmbed);
listenChannel('chat.join', sendJoinMessageEmbed);
listenChannel('chat.leave', sendLeaveMessageEmbed);
listenChannel('chat.death', sendDeathMessageEmbed);

startBot(BOT_TOKEN);
