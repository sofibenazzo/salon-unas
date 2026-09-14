import { Router } from "express";

import {
    obtenerDisponibilidad,
} from "../controllers/disponibilidad.controller.js";

const router = Router();

router.get(
    "/",
    obtenerDisponibilidad
);

export default router;  