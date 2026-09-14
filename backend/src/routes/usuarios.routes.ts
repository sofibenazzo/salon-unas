import { Router } from "express";

import {
    crearUsuario,
} from "../controllers/usuarios.controller.js";

const router = Router();

// Crear usuario / registrarse
router.post(
    "/",
    crearUsuario
);

export default router;
