import "dotenv/config";

import { Request, Response } from "express";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/client.js";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// Obtener servicios activos
export const obtenerServicios = async (
    _req: Request,
    res: Response
) => {
    try {
        const servicios = await prisma.servicio.findMany({
            where: {
                activo: true,
            },
            orderBy: {
                nombre: "asc",
            },
        });

        return res.json(servicios);
    } catch (error) {
        console.error("Error al obtener servicios:", error);

        return res.status(500).json({
            error: "No se pudieron obtener los servicios",
        });
    }
};

// Crear servicio
export const crearServicio = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            duracion,
        } = req.body;

        if (!nombre || precio === undefined || !duracion) {
            return res.status(400).json({
                error: "Nombre, precio y duración son obligatorios",
            });
        }

        const servicio = await prisma.servicio.create({
            data: {
                nombre,
                descripcion,
                precio,
                duracion: Number(duracion),
            },
        });

        return res.status(201).json(servicio);
    } catch (error) {
        console.error("Error al crear servicio:", error);

        return res.status(500).json({
            error: "No se pudo crear el servicio",
        });
    }
};

// Actualizar servicio
export const actualizarServicio = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const {
            nombre,
            descripcion,
            precio,
            duracion,
            activo,
        } = req.body;

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: "El ID del servicio no es válido",
            });
        }

        if (
            !nombre ||
            precio === undefined ||
            !duracion ||
            activo === undefined
        ) {
            return res.status(400).json({
                error: "Nombre, precio, duración y estado son obligatorios",
            });
        }

        const servicio = await prisma.servicio.findUnique({
            where: {
                id,
            },
        });

        if (!servicio) {
            return res.status(404).json({
                error: "El servicio no existe",
            });
        }

        const servicioActualizado =
            await prisma.servicio.update({
                where: {
                    id,
                },
                data: {
                    nombre,
                    descripcion,
                    precio,
                    duracion: Number(duracion),
                    activo,
                },
            });

        return res.json(servicioActualizado);
    } catch (error) {
        console.error("Error al actualizar servicio:", error);

        return res.status(500).json({
            error: "No se pudo actualizar el servicio",
        });
    }
};

// Eliminar servicio
export const eliminarServicio = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: "El ID del servicio no es válido",
            });
        }

        const servicio = await prisma.servicio.findUnique({
            where: {
                id,
            },
        });

        if (!servicio) {
            return res.status(404).json({
                error: "El servicio no existe",
            });
        }

        await prisma.servicio.delete({
            where: {
                id,
            },
        });

        return res.json({
            mensaje: "Servicio eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar servicio:", error);

        return res.status(500).json({
            error: "No se pudo eliminar el servicio",
        });
    }
};
