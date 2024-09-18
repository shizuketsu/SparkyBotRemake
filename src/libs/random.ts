export default class Random {
    public getRandomString(length:number):string {
        let result:string = '';
        let characters:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        for (let i:number = 0; i < length; i++) 
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        
        return result;
    }

    public getRandomInt(min:number, max:number):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}