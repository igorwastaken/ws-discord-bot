import { WebSocket } from 'ws';
import { Intents } from './util/types';
import { MessageChannel, MessageOptions } from './util/functions';

interface IdentifyPayload {
    op: number;
    d: {
        token: string;
        properties: {
            os: string;
            browser: string;
            device: string;
        };
        intents: number;
    };
}



export function initializeWebSocket(token: string, selectedIntents: Intents[]) {
    const intentsValue = selectedIntents.reduce((acc, intent) => acc | intent, 0);
    const ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');

    ws.on('open', () => {
        console.log('WebSocket connection established');

        const identifyPayload: IdentifyPayload = {
            op: 2,
            d: {
                token: token,
                properties: {
                    os: 'linux',
                    browser: 'custom:my_bot',
                    device: 'custom:my_bot'
                },
                intents: intentsValue
            }
        };

        ws.send(JSON.stringify(identifyPayload));
    });

    ws.on('message', (data) => {
        const payload = JSON.parse(data.toString());
        const { t, event, op, d } = payload;

        switch (op) {
            case 10:
                const { heartbeat_interval } = d;
                setInterval(() => {
                    ws.send(JSON.stringify({ op: 1, d: null }));
                }, heartbeat_interval);
                break;
        }

        if (t === 'READY') {
            console.log('Bot is ready!');
        }

        if (t === 'MESSAGE_CREATE') {
            const channel = new MessageChannel({
                token,
                channelID: d.channel_id
            });
            const { content, channel_id } = d;
            console.log(content)
            if (content.startsWith('!ping')) {

                const message: MessageOptions = {
                    content: "Hello world!"
                };
                channel.sendMessage(message)
            }
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
    });
}