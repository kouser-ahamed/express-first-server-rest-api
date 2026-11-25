import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router: Router = Router();

// post request to create a new user
// /api/v1/users
router.post("/", userController.createUser);
router.get("/",auth("admin","agent"), userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

export const userRoute = router;
