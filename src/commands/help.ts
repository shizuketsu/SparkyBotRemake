import { Message } from "discord.js";

export default {
    name: 'help', // @ts-ignore
    async execute(msg: Message, args:Array<string>) {
        msg.reply('hola');
    }
};