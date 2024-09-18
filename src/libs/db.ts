import mysql from "mysql2/promise";

export default class db {
    constructor(
        private userName:string,
        private pass:string,
        private host:string,
        private dbname:string,
        callback:() => void
    ) {
        this.createConnection(callback);
    }

    public async createConnection(callback:() => void) {
        this.connection = await mysql.createConnection({
            user: this.userName,
            password: this.pass,
            host: this.host,
            database: this.dbname
        });

        callback();
    }
    
    public async query(sql:string, params: any[]) {
        if(!this.connection) throw new Error('Connection not established');

        const [rows, fields] = await this.connection.execute(sql, params);
        const isSelectQuery = sql.trim().toUpperCase().startsWith('SELECT');

        return { 
            rows: isSelectQuery ? (rows as any[]) : [],
            rowCount: isSelectQuery ? (rows as any[]).length : 0,
            fields: isSelectQuery ? fields : []
        };
    }

    public async close() {
        if(this.connection) await this.connection.end();
    }

    private connection!: mysql.Connection;
}
