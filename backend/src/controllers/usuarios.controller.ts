import "dotenv/config";

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/client.js";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// Crear usuario
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

        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({
                error: "Nombre, apellido, email y contraseña son obligatorios",
            });
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        if (usuarioExistente) {
            return res.status(409).json({
                error: "Ya existe un usuario con ese email",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                email,
                telefono,
                password: passwordHash,
                rol: rol || "CLIENTE",
            },
        });

        return res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                telefono: usuario.telefono,
                rol: usuario.rol,
                activo: usuario.activo,
                creadoEn: usuario.creadoEn,
            },
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);

        return res.status(500).json({
            error: "No se pudo crear el usuario",
        });
    }
};