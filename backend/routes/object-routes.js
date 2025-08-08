import { Router } from "express";
import * as objectController from "../controllers/object-controller.js"
const router = Router();

router
    .route("/")
    .get(objectController.getObjects)
    //.post(objectController.createObject);

export default router;
