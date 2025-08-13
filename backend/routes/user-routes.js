import { Router } from "express";
import * as userController from "../controllers/user-controller.js";
import { validateToken } from "../middleware/validateToken.js";

const router = Router();

router.route("/")
    .post(userController.createUser)
    .get(userController.getUsers);

// Nova rota GET /api/users/current protegida pelo middleware
router.get("/current", validateToken, userController.getCurrentUser);

router.route("/:id")
    .delete(userController.deleteUser)
    .put(userController.updateUser)
    .get(userController.getUserById);

// Nova rota POST /api/users/login para login
router.post("/login", userController.loginUser);

export default router;