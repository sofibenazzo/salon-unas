import "dotenv/config";

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/client.js";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email y contraseña son obligatorios",
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        if (!usuario) {
            return res.status(401).json({
                error: "Email o contraseña incorrectos",
            });
        }

        if (!usuario.activo) {
            return res.status(403).json({
                error: "El usuario está inactivo",
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: "Email o contraseña incorrectos",
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                error: "JWT_SECRET no está configurado",
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
            },
            secret,
            {
                expiresIn: "8h",
            }
        );

        return res.json({
            mensaje: "Login exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                telefono: usuario.telefono,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        console.error("Error en login:", error);

        return res.status(500).json({
            error: "No se pudo iniciar sesión",
        });
    }
};