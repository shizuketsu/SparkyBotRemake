import { Message, EmbedBuilder } from "discord.js";

export default {
    name: 'help', // @ts-ignore
    async execute(msg: Message, args:Array<string>, db?:any) {
        const embed:EmbedBuilder = new EmbedBuilder()
            .setColor('#ffbe79')
            .setTitle('Commands:')
            .setDescription('**:grey_question: Guess**\nGuess Geometry Dash Levels from pictures to get points! Use .guess\n\n**:bust_in_silhouette: Profile**\nView other players scores while competing with them. Use .profile')
            .setFooter({ text: 'Requested by ' + msg.author.username, iconURL: msg.author.displayAvatarURL() });

        msg.reply({ embeds: [embed] });
    }
};