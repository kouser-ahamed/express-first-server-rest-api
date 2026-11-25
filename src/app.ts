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
import globalErrorHandler from "./middleware/globalErrorHandler";
import cors from "cors";

dotenv.config();

const app: Application = express();

const corsOptions = {
  origin: "http://localhost:3000",
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Apply CORS middleware with options

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

// Global Error Handler Middleware
app.use(globalErrorHandler);

export { app };

export default app;
