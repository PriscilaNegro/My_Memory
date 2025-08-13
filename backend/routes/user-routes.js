import { Router } from "express";
import * as userController from "../controllers/user-controller.js";

const router = Router();

router.route("/")
    .post(userController.createUser)
    .get(userController.getUsers);

router.route("/:id")
    .delete(userController.deleteUser)
    .put(userController.updateUser)
    .get(userController.getUserById);

export default router;