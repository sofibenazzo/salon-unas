import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { PrismaClient } from "../generated/client.js";
import { PrismaMssql } from "@prisma/adapter-mssql";

const adapter = new PrismaMssql(
    process.env.DATABASE_URL!
);

const prisma = new PrismaClient({
    adapter,
});

export const crearUsuario = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            nombre,
            apellido,
            email,
            telefono,
            password,
            rol,
        } = req.body;

        if (
            !nombre ||
            !apellido ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                error:
                    "Nombre, apellido, email y contraseña son obligatorios.",
            });
        }

        const emailNormalizado =
            String(email)
                .trim()
                .toLowerCase();

        const usuarioExistente =
            await prisma.usuario.findUnique({
                where: {
                    email: emailNormalizado,
                },
            });

        if (usuarioExistente) {
            return res.status(409).json({
                error:
                    "Ya existe un usuario con ese email.",
            });
        }

        const passwordEncriptada =
            await bcrypt.hash(
                String(password),
                10
            );

        const usuario =
            await prisma.usuario.create({
                data: {
                    nombre:
                        String(nombre).trim(),

                    apellido:
                        String(apellido).trim(),

                    email:
                        emailNormalizado,

                    telefono:
                        telefono
                            ? String(telefono).trim()
                            : null,

                    password:
                        passwordEncriptada,

                    rol:
                        rol || "CLIENTE",
                },

                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    email: true,
                    telefono: true,
                    rol: true,
                    activo: true,
                    creadoEn: true,
                },
            });

        return res.status(201).json(usuario);

    } catch (error) {
        console.error(
            "Error al crear usuario:",
            error
        );

        return res.status(500).json({
            error:
                "No se pudo crear el usuario.",
        });
    }
};


export const obtenerOCrearCliente = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            nombre,
            apellido,
            telefono,
            email,
        } = req.body;

        if (
            !nombre ||
            !apellido ||
            !email
        ) {
            return res.status(400).json({
                error:
                    "Nombre, apellido y email son obligatorios.",
            });
        }

        const emailNormalizado =
            String(email)
                .trim()
                .toLowerCase();

        const clienteExistente =
            await prisma.usuario.findUnique({
                where: {
                    email: emailNormalizado,
                },
            });

        if (clienteExistente) {

            if (!clienteExistente.activo) {
                return res.status(403).json({
                    error:
                        "El cliente se encuentra inactivo.",
                });
            }

            return res.json({
                id:
                    clienteExistente.id,

                nombre:
                    clienteExistente.nombre,

                apellido:
                    clienteExistente.apellido,

                email:
                    clienteExistente.email,

                telefono:
                    clienteExistente.telefono,
            });
        }

        const passwordInterna =
            Math.random()
                .toString(36)
                .slice(-12);

        const passwordEncriptada =
            await bcrypt.hash(
                passwordInterna,
                10
            );

        const nuevoCliente =
            await prisma.usuario.create({
                data: {
                    nombre:
                        String(nombre).trim(),

                    apellido:
                        String(apellido).trim(),

                    email:
                        emailNormalizado,

                    telefono:
                        telefono
                            ? String(telefono).trim()
                            : null,

                    password:
                        passwordEncriptada,

                    rol:
                        "CLIENTE",

                    activo:
                        true,
                },

                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    email: true,
                    telefono: true,
                },
            });

        return res.status(201).json(
            nuevoCliente
        );

    } catch (error) {
        console.error(
            "Error al obtener o crear cliente:",
            error
        );

        return res.status(500).json({
            error:
                "No se pudo obtener o crear el cliente.",
        });
    }
};


export const obtenerClientes = async (
    _req: Request,
    res: Response
) => {
    try {
        const clientes =
            await prisma.usuario.findMany({
                where: {
                    rol: "CLIENTE",
                },

                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    email: true,
                    telefono: true,
                    activo: true,
                    creadoEn: true,

                    _count: {
                        select: {
                            turnos: true,
                        },
                    },
                },

                orderBy: [
                    {
                        nombre: "asc",
                    },

                    {
                        apellido: "asc",
                    },
                ],
            });

        return res.json(clientes);

    } catch (error) {
        console.error(
            "Error al obtener clientes:",
            error
        );

        return res.status(500).json({
            error:
                "No se pudieron obtener los clientes.",
        });
    }
};


export const cambiarEstadoCliente = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                error:
                    "El ID del cliente no es válido.",
            });
        }

        const cliente =
            await prisma.usuario.findUnique({
                where: {
                    id,
                },
            });

        if (!cliente) {
            return res.status(404).json({
                error:
                    "No se encontró el cliente.",
            });
        }

        if (cliente.rol !== "CLIENTE") {
            return res.status(400).json({
                error:
                    "El usuario indicado no es un cliente.",
            });
        }

        const clienteActualizado =
            await prisma.usuario.update({
                where: {
                    id,
                },

                data: {
                    activo:
                        !cliente.activo,
                },

                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    email: true,
                    telefono: true,
                    activo: true,
                    creadoEn: true,

                    _count: {
                        select: {
                            turnos: true,
                        },
                    },
                },
            });

        return res.json(
            clienteActualizado
        );

    } catch (error) {
        console.error(
            "Error al cambiar estado del cliente:",
            error
        );

        return res.status(500).json({
            error:
                "No se pudo cambiar el estado del cliente.",
        });
    }
};
