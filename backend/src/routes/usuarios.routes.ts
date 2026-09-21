import { Router } from "express";

import {
    crearUsuario,
    obtenerOCrearCliente,
    obtenerClientes,
    cambiarEstadoCliente,
} from "../controllers/usuarios.controller.js";

import { autenticar } from "../middleware/auth.middleware.js";
import { soloAdmin } from "../middleware/admin.middleware.js";

const router = Router();


router.post(
    "/",
    crearUsuario
);


router.post(
    "/cliente-reserva",
    obtenerOCrearCliente
);


router.get(
    "/clientes",
    autenticar,
    soloAdmin,
    obtenerClientes
);


router.patch(
    "/clientes/:id/estado",
    autenticar,
    soloAdmin,
    cambiarEstadoCliente
);


export default router;
