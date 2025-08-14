import { Router } from "express";
import * as itemController from "../controllers/item-controller.js";
import { validateToken } from "../middleware/validateToken.js";

const router = Router();

router.use(validateToken);

router.route("/").post(itemController.createItem).get(itemController.getItems);

router
    .route("/:id")
    .get(itemController.getItemById)
    .put(itemController.updateItem)
    .delete(itemController.deleteItem);

export default router;
