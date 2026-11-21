import { Pool } from "pg";
import config from "../config";
export const pool = new Pool({
  connectionString: config.CONNECTION_STRING,
});
// console.log(pool);

//
export const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        age INT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,

        is_Active BOOLEAN DEFAULT true,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()


        );
        `);
    console.log("Database Connected Successfully........!");
  } catch (error) {
    console.log(error);
  }
};
