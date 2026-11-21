import dotenv from "dotenv";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is Running Successfully........!",
    author: "Kouser Ahamed",
  });
});

app.use("/api/v1/users", userRoute);

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
      UPDATE users SET name =COALESCE($1, name), age =COALESCE($2, age), password =COALESCE($3, password), is_Active =COALESCE($4, is_Active), updated_at = NOW() WHERE id = $5 RETURNING *`,
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

app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found........!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully........!",
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

export default app;
