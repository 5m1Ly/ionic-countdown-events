import MySQL, { Pool, PoolOptions, PoolConnection } from "mysql2/promise";
import { Debug } from "./debug";

const options: PoolOptions = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'countdown_events',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
}

export class Database extends Debug {

    db: Pool = MySQL.createPool(options);

    async query(sql: string, data?: any) {

        const conn: PoolConnection = await this.clockAsync("fetching database connection", async () => this.db.getConnection());

        const fsql: string = this.clock("formatting query", () => conn.format(sql, data))

        const a = this.timed("executing formatted sql query");
        const [rows, fields] = await conn.execute(fsql)
        a()

        conn.release()

        return rows;
    }

}
