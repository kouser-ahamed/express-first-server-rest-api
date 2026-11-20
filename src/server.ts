import dotenv from "dotenv";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

dotenv.config();

const app: Application = express();
const port = 5000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_POOLED,
});
// console.log(pool);

//
const initDB = async () => {
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

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is Running Successfully........!",
    author: "Kouser Ahamed",
  });
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, age, email, password } = req.body;
    const result = await pool.query(
      `
    INSERT INTO users (name, age, email, password) VALUES
    ($1,$2,$3,$4) RETURNING * 
    `,
      [name, age, email, password],
    );
    //   console.log(result);
    res.status(201).json({
      success: true,
      message: "User Created Successfully........!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
    SELECT * FROM users`);
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "Users Fetched Successfully........!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id = $1`,
      [id],
    );
    res.status(200).json({
      success: true,
      message: "User Fetched Successfully........!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});
app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, password, is_Active } = req.body;
    const result = await pool.query(
      `
      UPDATE users SET name =COALESCE($1, name), age =COALESCE($2, age), password =COALESCE($3, password), is_Active =COALESCE($4, is_Active) WHERE id = $5 RETURNING *`,
      [name ?? null, age ?? null, password ?? null, is_Active ?? null, id],
    );
    res.status(200).json({
      success: true,
      message: "User Updated Successfully........!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is Running Successfully.......!`);
});
