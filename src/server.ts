import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

const app: Application = express();
const port = 5000;

app.use(express.json());

const pool = new Pool({
  connectionString: "process.env.DATABASE_URL_POOLED",
});
// console.log(pool);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is Running Successfully........!",
    author: "Kouser Ahamed",
  });
});

app.post("/", async (req: Request, res: Response) => {
  const { name, age, password } = req.body;
  //   console.log(password);
  res.status(200).json({
    success: true,
    message: "Data Received Successfully........!",
    data: { name, age },
  });
});

app.listen(port, () => {
  console.log(`Server is Running Successfully.......!`);
});
