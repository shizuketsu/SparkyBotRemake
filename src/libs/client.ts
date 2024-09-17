import { Client as DiscordClient, Collection, GatewayIntentBits } from "discord.js";

interface IClient extends DiscordClient {
    commands: Collection<string, any>;
}

export default class Client extends DiscordClient implements IClient {
    public commands: Collection<string, any>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.commands = new Collection<string, any>();
    }
}