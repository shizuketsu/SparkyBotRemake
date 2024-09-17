import fs from "fs"; 
import path from "path"; 
import database from "./libs/db";
import Client from "./libs/client"; 
import Commands from "./libs/commands";
import params from "../config.json"; 

const client = new Client();
const cmanage = new Commands();
const commandFiles:ReadonlyArray<string> = fs.readdirSync(path.join(__dirname, "commands")).filter((e) => e.endsWith('.ts')); 

// @ts-ignore
const db = new database(params.db.userName, params.db.password, params.db.host, params.db.dbname); 

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

    if(msg.content.startsWith(params.prefix)) { 
        const args:Array<string> = msg.content.slice(params.prefix.length).trim().split(/ +/); 
        const commandName:string = <string>args.shift()?.toLowerCase(); 
        if (!cmanage.cget(commandName)) return;
        const command = cmanage.cget(commandName); 
        
        try {
            console.log('1');
            command?.obj.execute(msg, args);
        } catch(e) { 
            console.log(e); msg.reply('command err'); 
        } 
    }
}); 

client.login(params.token);