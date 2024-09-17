import fs from "fs";
import path from "path";
import database from "./libs/db";
import Client from "./libs/client";
import params from "../config.json";

const client = new Client();
const commandFiles:ReadonlyArray<string> = fs.readdirSync(path.join(__dirname, "commands")).filter((e) => e.endsWith('.ts'));

for(const file of commandFiles) {
    import(path.join(__dirname, "commands", file))
        .then((command) => {
            const commandName = file.replace('.ts', '');
            client.commands.set(commandName, command);
        })
        .catch((err) => {
            console.error(`Error while load command ${file}: `, err);
        });
}

const db = new database(params.db.userName, params.db.password, params.db.host, params.db.dbname);
db.createConnection();

client.once("ready", () => {
    client.user?.setPresence({ status: "idle" });
    console.log("Bot was started at " + client.user?.tag);
});

client.on('messageCreate', async (msg) => {
    if(msg.author.bot) return;

    const args:Array<string> = msg.content.slice(params.prefix.length).trim().split(/ +/);
    const commandName:string = <string>args.shift()?.toLowerCase();
    if(!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    try {
        command.execute(msg, args);
    } catch(e) {
        console.log(e);
        msg.reply('command err');
    }
});

client.login(params.token);