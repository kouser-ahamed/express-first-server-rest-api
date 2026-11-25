import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../types";

const router: Router = Router();

// post request to create a new user
// /api/v1/users
router.post("/", userController.createUser);
router.get(
  "/",
  auth(USER_ROLES.admin, USER_ROLES.agent),
  userController.getAllUsers,
);
router.get(
  "/:id",
  auth(USER_ROLES.admin, USER_ROLES.agent, USER_ROLES.user),
  userController.getUserById,
);
router.put(
  "/:id",
  auth(USER_ROLES.admin, USER_ROLES.user),
  userController.updateUserById,
);
router.delete("/:id", auth(USER_ROLES.admin), userController.deleteUserById);

export const userRoute = router;
