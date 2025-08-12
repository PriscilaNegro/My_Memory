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

    router.route("/name/:name")
    .get(userController.getUsersByName);

    router.route("/email/:email")
    .get(userController.getUserByEmail);

export default router;