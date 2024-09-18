import { Message, TextChannel, EmbedBuilder, MessageCollector } from "discord.js";
import Levels from "../libs/levels";

export default {
    name: 'guess',
    async execute(msg: Message, args: Array<string>, db:any) {
        const lvl: Levels = new Levels();
        const level: Array<string> = lvl.getLevel(args[1]);

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor('#ffbe79')
            .setTitle('Guess the Level:')
            .setDescription('Difficulty: ' + level[3])
            .setImage(level[4])
            .setFooter({ text: 'Requested by ' + msg.author.username, iconURL: msg.author.displayAvatarURL() });

        const botMsg = await msg.reply({ embeds: [embed] });
        
        if (msg.channel instanceof TextChannel) {
            const filter = (res: Message) => {
                return res.author.id !== msg.client.user?.id;
            };

            const collector: MessageCollector = msg.channel.createMessageCollector({ filter, time: 10000 });

            collector.on('collect', async (collected: Message) => {
                if(collected.content.toLowerCase().trim() === level[1].toLowerCase()) {
                    collector.stop();
                    let pts:string = '0';

                    if(level[3] === 'easy') {
                        pts = '1';
                    } else if(level[3] === 'normal') {
                        pts = '3';
                    } else if(level[3] === 'hard') {
                        pts = '10';
                    }

                    let newPts:number;
                    const r = await db.query('SELECT * FROM users WHERE userID = ? AND serverID = ?', [collected.author.id, collected.guildId]);
                        
                    if(r.rows.length < 1) {
                        newPts = Number(pts);
                        await db.query('INSERT INTO users (userID, serverID, points) VALUES (?, ?, ?)', [collected.author.id, collected.guildId, Number(pts)]);
                    } else {
                        newPts = r.rows[0].points + Number(pts);
                        await db.query('UPDATE users SET points = ? WHERE userID = ? AND serverID = ?', [newPts, collected.author.id, collected.guildId]);
                    }

                    const embed:EmbedBuilder = new EmbedBuilder()
                        .setColor('#ffbe79')
                        .setTitle('Congratulations! ' + collected.author.displayName + ' guessed right:')
                        .setDescription(`__${level[1]}__ by ${level[2]}\nDifficult: ${level[3]}\nPoints: \`${newPts}\``)

                    collected.reply({ embeds: [embed] });
                }
            });

            // @ts-ignore
            collector.on('end', (collected, reason) => {
                if(reason === 'time') {
                    const embed:EmbedBuilder = new EmbedBuilder()
                        .setColor('#ffbe79')
                        .setTitle('Time\'s up!')
                        .setDescription(`__${level[1]}__ by ${level[2]}\nDifficult: ${level[3]}\nPoints: \`0\``)

                    botMsg.reply({ embeds: [embed] });
                }
            });
        }
    }
};