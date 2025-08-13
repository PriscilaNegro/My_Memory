import { Router } from "express";
import * as locationController from "../controllers/location-controller.js";
import { validateToken } from "../middleware/validateToken.js";

const router = Router();

router.use(validateToken);

router.route("/")
    .post(locationController.createLocation)
    .get(locationController.getAllLocations); // listar todas, se quiser limitar só para admins, depois adiciona middleware

// Listar todas as localizações do usuário logado
router.get("/me", locationController.getMyLocations);


router.route("/:id")
    .get(locationController.getLocationById)
    .put(locationController.updateLocation)
    .delete(locationController.deleteLocation);

export default router;