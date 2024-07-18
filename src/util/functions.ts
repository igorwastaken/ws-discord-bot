import axios from "axios";
import { AllowedMentionsTypes, AttachmentData, ComponentData, EmbedData, MessageReference, PollData, Snowflake } from "discord.js";

export type MessageChannelOptions = {
    token: string;
    channelID: string;
}

export type MessageOptions = {
    tts?: boolean;
    content?: string;
    nonce?: number | string;
    embeds?: EmbedData[];
    allowed_mentions?: AllowedMentionsTypes;
    message_reference?: MessageReference;
    components?: ComponentData[];
    sticker_ids?: Snowflake[];
    files?: any;
    payload_json?: string;
    attachments?: AttachmentData[];
    flags?: number;
    enforce_nonce?: boolean;
    polls?: PollData;
}

export class MessageChannel {
    public token: string;
    public channel_id: string;
    constructor(options: MessageChannelOptions) {
        this.token = options.token;
        this.channel_id = options.channelID;
    }
    async sendMessage(options: MessageOptions) {
        try {
          await axios.post(
            `https://discord.com/api/v10/channels/${this.channel_id}/messages`,
            { ...options },
            {
              headers: {
                Authorization: `Bot ${this.token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
}