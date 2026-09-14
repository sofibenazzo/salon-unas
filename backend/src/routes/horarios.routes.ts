import { Router } from "express";

import {
    obtenerHorarios,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
} from "../controllers/horarios.controller.js";

import { autenticar } from "../middleware/auth.middleware.js";
import { soloAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Obtener horarios
router.get(
    "/",
    autenticar,
    soloAdmin,
    obtenerHorarios
);

// Crear horario
router.post(
    "/",
    autenticar,
    soloAdmin,
    crearHorario
);

// Actualizar horario
router.put(
    "/:id",
    autenticar,
    soloAdmin,
    actualizarHorario
);

// Eliminar horario
router.delete(
    "/:id",
    autenticar,
    soloAdmin,
    eliminarHorario
);

export default router;
