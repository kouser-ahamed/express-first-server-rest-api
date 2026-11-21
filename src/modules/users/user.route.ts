import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// post request to create a new user
// /api/v1/users
router.post("/", userController.createUser);

export const userRoute = router;
