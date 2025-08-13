import { Router } from "express";
import * as itemController from "../controllers/item-controller.js"
const router = Router();

router
    .route("/")
    .get(itemController.getItems)
    //.post(itemController.createItem);

export default router;
