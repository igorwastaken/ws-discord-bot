import 'dotenv/config';
import { initializeWebSocket } from './wsClient';
import { Intents } from './util/types';

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Please set your DISCORD_TOKEN in the .env file');
  process.exit(1);
}

initializeWebSocket(token, [Intents.GUILDS, Intents.GUILD_MESSAGES, Intents.MESSAGE_CONTENT, Intents.GUILD_MEMBERS]);