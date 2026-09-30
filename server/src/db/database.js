import {Pool} from "pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
    console.log("Connected to PostgresSql");
});

pool.on("error", () => {
    console.log(`Unexpected error: ${error}`);
});

export default pool;