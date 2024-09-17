interface ICommand {
    commandName:string,
    obj:any
}

export default class Commands {
    public cget(commandName:string):ICommand|null {
        return this.commands.find(command => command.commandName === commandName) || null;
    }

    public cset(commandName:string, obj:any):void {
        this.commands.push({ commandName, obj });
    }

    public readonly commands:Array<ICommand> = [];
}