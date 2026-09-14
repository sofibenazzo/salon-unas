import { Router } from "express";

import {
    obtenerServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
} from "../controllers/servicios.controller.js";

import { autenticar } from "../middleware/auth.middleware.js";
import { soloAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Obtener servicios activos
router.get("/", obtenerServicios);

// Crear servicio
router.post(
    "/",
    autenticar,
    soloAdmin,
    crearServicio
);

// Actualizar servicio
router.put(
    "/:id",
    autenticar,
    soloAdmin,
    actualizarServicio
);

// Eliminar servicio
router.delete(
    "/:id",
    autenticar,
    soloAdmin,
    eliminarServicio
);

export default router;
