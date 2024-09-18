import fs from "fs"; 
import path from "path"; 
import database from "./libs/db";
import Client from "./libs/client"; 
import Commands from "./libs/commands";
import serverCache from "./libs/cache";
import params from "../config.json"; 

const client = new Client();
const cmanage = new Commands();
const commandFiles:ReadonlyArray<string> = fs.readdirSync(path.join(__dirname, "commands")).filter((e) => e.endsWith('.ts')); 
const db = new database(params.db.userName, params.db.password, params.db.host, params.db.dbname, () => console.log('db connection was created'));

for(const file of commandFiles) { 
    const module = require(path.join(__dirname, "commands", file));
    const command = module.default || module;
    const commandName = file.replace('.ts', '');
    cmanage.cset(commandName, command);
}

client.once("ready", () => { 
    client.user?.setPresence({ status: "idle" }); 
    console.log("Bot was started at " + client.user?.tag);
}); 

client.on('messageCreate', async (msg) => { 
    if(msg.author.bot) return; 

    if (!serverCache.has(<string>msg.guildId)) {
        const r = await db.query('SELECT * FROM servers WHERE serverID = ?', [msg.guildId]);
        if (r.rowCount < 1) {
            await db.query('INSERT INTO servers (serverID, prefix) VALUES (?, ?)', [msg.guildId, '.']);
            serverCache.set(<string>msg.guildId, { serverID: msg.guildId, prefix: '.' });
        } else {
            serverCache.set(<string>msg.guildId, r.rows[0]);
        }
    }
    
    if(msg.content.startsWith(serverCache.get(<string>msg.guildId).prefix)) { 
        const args:Array<string> = msg.content.slice(serverCache.get(<string>msg.guildId).prefix.length).trim().split(/ +/); 
        const commandName:string = <string>args.shift()?.toLowerCase(); 
        if (!cmanage.cget(commandName)) return;
        const command = cmanage.cget(commandName); 
        
        try {
            command?.obj.execute(msg, args, db);
        } catch(e) { 
            console.log(e); msg.reply('command err'); 
        } 
    }
}); 

client.login(params.token);