import { Message, EmbedBuilder, User } from "discord.js";

export default {
    name: 'profile', // @ts-ignore
    async execute(msg: Message, args:Array<string>, db:any) {
        let currID:string;
        let currUserName:string;

        if(msg.mentions.users.size > 0) {
            const firstMentionedUser:User = <User>msg.mentions.users.first();
            currID = firstMentionedUser.id;
            currUserName = firstMentionedUser.username;
        } else {
            currID = msg.author.id;
            currUserName = msg.author.username;
        }

        const r = await db.query('SELECT * FROM users WHERE userID = ? AND serverID = ?', [currID, msg.guildId]);
        if(r.rows.length < 1) {
            msg.reply('User not found');
        } else {
            const embed:EmbedBuilder = new EmbedBuilder()
                .setColor('#ffbe79')
                .setTitle(currUserName + ' profile:')
                .setDescription('Points: `' + r.rows[0].points + '`')
                .setFooter({ text: 'Requested by ' + msg.author.username, iconURL: msg.author.displayAvatarURL() });

            msg.reply({ embeds: [embed] });
        }
    }
};