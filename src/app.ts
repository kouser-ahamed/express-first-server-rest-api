import dotenv from "dotenv";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/users/user.route";
import { profileRouter } from "./modules/profiles/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";

dotenv.config();

const app: Application = express();

app.use(logger);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is Running Successfully........!",
    author: "Kouser Ahamed",
  });
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/auth", authRoute);

export default app;
