import "dotenv/config";

import { Request, Response } from "express";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/client.js";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// Obtener horarios
export const obtenerHorarios = async (
    _req: Request,
    res: Response
) => {
    try {
        const horarios = await prisma.horarioAtencion.findMany({
            orderBy: [
                {
                    diaSemana: "asc",
                },
                {
                    horaInicio: "asc",
                },
            ],
        });

        return res.json(horarios);
    } catch (error) {
        console.error("Error al obtener horarios:", error);

        return res.status(500).json({
            error: "No se pudieron obtener los horarios",
        });
    }
};

// Crear horario
export const crearHorario = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            diaSemana,
            horaInicio,
            horaFin,
        } = req.body;

        if (
            diaSemana === undefined ||
            !horaInicio ||
            !horaFin
        ) {
            return res.status(400).json({
                error: "Día, hora de inicio y hora de fin son obligatorios",
            });
        }

        const dia = Number(diaSemana);

        if (!Number.isInteger(dia) || dia < 1 || dia > 7) {
            return res.status(400).json({
                error: "El día de la semana debe estar entre 1 y 7",
            });
        }

        if (horaInicio >= horaFin) {
            return res.status(400).json({
                error: "La hora de inicio debe ser anterior a la hora de fin",
            });
        }

        const horario = await prisma.horarioAtencion.create({
            data: {
                diaSemana: dia,
                horaInicio,
                horaFin,
            },
        });

        return res.status(201).json(horario);
    } catch (error) {
        console.error("Error al crear horario:", error);

        return res.status(500).json({
            error: "No se pudo crear el horario",
        });
    }
};

// Actualizar horario
export const actualizarHorario = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const {
            diaSemana,
            horaInicio,
            horaFin,
            activo,
        } = req.body;

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: "El ID del horario no es válido",
            });
        }

        if (
            diaSemana === undefined ||
            !horaInicio ||
            !horaFin ||
            activo === undefined
        ) {
            return res.status(400).json({
                error: "Día, hora de inicio, hora de fin y estado son obligatorios",
            });
        }

        const dia = Number(diaSemana);

        if (!Number.isInteger(dia) || dia < 1 || dia > 7) {
            return res.status(400).json({
                error: "El día de la semana debe estar entre 1 y 7",
            });
        }

        if (horaInicio >= horaFin) {
            return res.status(400).json({
                error: "La hora de inicio debe ser anterior a la hora de fin",
            });
        }

        const horario = await prisma.horarioAtencion.findUnique({
            where: {
                id,
            },
        });

        if (!horario) {
            return res.status(404).json({
                error: "El horario no existe",
            });
        }

        const horarioActualizado =
            await prisma.horarioAtencion.update({
                where: {
                    id,
                },
                data: {
                    diaSemana: dia,
                    horaInicio,
                    horaFin,
                    activo,
                },
            });

        return res.json(horarioActualizado);
    } catch (error) {
        console.error("Error al actualizar horario:", error);

        return res.status(500).json({
            error: "No se pudo actualizar el horario",
        });
    }
};

// Eliminar horario
export const eliminarHorario = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: "El ID del horario no es válido",
            });
        }

        const horario = await prisma.horarioAtencion.findUnique({
            where: {
                id,
            },
        });

        if (!horario) {
            return res.status(404).json({
                error: "El horario no existe",
            });
        }

        await prisma.horarioAtencion.delete({
            where: {
                id,
            },
        });

        return res.json({
            mensaje: "Horario eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar horario:", error);

        return res.status(500).json({
            error: "No se pudo eliminar el horario",
        });
    }
};
