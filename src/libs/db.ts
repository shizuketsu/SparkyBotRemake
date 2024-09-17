import mysql from "mysql2/promise";

export default class db {
    constructor(
        private userName:string,
        private pass:string,
        private host:string,
        private dbname:string
    ) {}

    public async createConnection() {
        this.connection = await mysql.createConnection({
            user: this.userName,
            password: this.pass,
            host: this.host,
            database: this.dbname
        });
    }
    
    public async query(sql:string, params: any[]) {
        if(!this.connection) throw new Error('Connection not established');

        const [rows] = await this.connection.execute(sql, params);
        return rows;
    }

    public async close() {
        if(this.connection) await this.connection.end();
    }

    private connection!: mysql.Connection;
}