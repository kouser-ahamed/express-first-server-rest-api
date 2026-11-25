import { Router } from "express";
import { profileController } from "./profile.controller";
const router: Router = Router();

router.post("/", profileController.createProfile);

export const profileRouter = router;
