import fs from "fs";
import path from "path";
import Random from "./random";

export default class Levels {
    constructor() {
        this.file = fs.readFileSync(path.join(__dirname, '../../levels.txt'), 'utf-8');
        this.rand = new Random();
    }
    
    public getLevel(difficult?:string): Array<string> {
        if(difficult !== 'easy' && difficult !== 'normal' && difficult !== 'hard') difficult = 'easy';
        const lines = this.file.split('\n').map(line => line.replace(/\r$/, '')).filter((line) => line);
        const currLevels:Array<Array<string>> = lines.map((line) => line.split(';')).filter((params) => params[3] === difficult);

        if (currLevels.length === 0) return [];
        return currLevels[this.rand.getRandomInt(0, currLevels.length - 1)];
    }

    private file:string;
    private rand:Random;
}