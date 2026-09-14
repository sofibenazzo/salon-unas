import { Router } from "express";

import {
    obtenerTurnos,
    crearTurno,
    cancelarTurno,
    cambiarEstadoTurno,
} from "../controllers/turnos.controller.js";

import { autenticar } from "../middleware/auth.middleware.js";
import { soloAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Obtener todos los turnos
router.get(
    "/",
    autenticar,
    soloAdmin,
    obtenerTurnos
);

// Crear turno
router.post(
    "/",
    crearTurno
);

// Cancelar turno
router.delete(
    "/:id",
    autenticar,
    cancelarTurno
);

// Cambiar estado del turno
router.patch(
    "/:id/estado",
    autenticar,
    soloAdmin,
    cambiarEstadoTurno
);

export default router;