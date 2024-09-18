import { Message, PermissionFlagsBits } from "discord.js";
import serverCache from "../libs/cache";

export default {
    name: 'help',
    async execute(msg: Message, args:Array<string>, db:any) {
        if(!msg.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return await msg.reply('You do not have enough rights for this command');
        else if(!args) return await msg.reply('Specify prefix');

        const newPrefix:string = args[0];
        await db.query('UPDATE servers SET prefix = ? WHERE serverID = ?', [newPrefix, msg.guildId]);

        if (serverCache.has(<string>msg.guildId)) {
            const serverData = serverCache.get(<string>msg.guildId);
            serverCache.set(<string>msg.guildId, { ...serverData, prefix: newPrefix });
        }

        return await msg.reply('Prefix was changed');
    }
};