import "dotenv/config";

import { Request, Response } from "express";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/client.js";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// Obtener todos los turnos
export const obtenerTurnos = async (
    _req: Request,
    res: Response
) => {
    try {
        const turnos = await prisma.turno.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        email: true,
                        telefono: true,
                    },
                },
                servicio: true,
            },
            orderBy: {
                fechaHora: "asc",
            },
        });

        return res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos:", error);

        return res.status(500).json({
            error: "No se pudieron obtener los turnos",
        });
    }
};

// Crear turno
export const crearTurno = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            fechaHora,
            usuarioId,
            servicioId,
            observacion,
        } = req.body;

        if (
            !fechaHora ||
            usuarioId === undefined ||
            servicioId === undefined
        ) {
            return res.status(400).json({
                error: "Fecha, usuario y servicio son obligatorios",
            });
        }

        const usuarioIdNumero = Number(usuarioId);
        const servicioIdNumero = Number(servicioId);

        if (
            !Number.isInteger(usuarioIdNumero) ||
            !Number.isInteger(servicioIdNumero)
        ) {
            return res.status(400).json({
                error: "Usuario o servicio inválido",
            });
        }

        const fecha = new Date(fechaHora);

        if (Number.isNaN(fecha.getTime())) {
            return res.status(400).json({
                error: "La fecha y hora no son válidas",
            });
        }

        if (fecha <= new Date()) {
            return res.status(400).json({
                error: "No se puede reservar un turno en el pasado",
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: usuarioIdNumero,
            },
        });

        if (!usuario) {
            return res.status(404).json({
                error: "El usuario no existe",
            });
        }

        if (!usuario.activo) {
            return res.status(400).json({
                error: "El usuario está inactivo",
            });
        }

        const servicio = await prisma.servicio.findUnique({
            where: {
                id: servicioIdNumero,
            },
        });

        if (!servicio) {
            return res.status(404).json({
                error: "El servicio no existe",
            });
        }

        if (!servicio.activo) {
            return res.status(400).json({
                error: "El servicio no está disponible",
            });
        }

        const diaSemana =
            fecha.getDay() === 0
                ? 7
                : fecha.getDay();

        // Buscar todos los bloques de atención de ese día
        const horarios =
            await prisma.horarioAtencion.findMany({
                where: {
                    diaSemana,
                    activo: true,
                },
                orderBy: {
                    horaInicio: "asc",
                },
            });

        if (horarios.length === 0) {
            return res.status(400).json({
                error: "El salón no atiende ese día",
            });
        }

        const fechaTexto = fechaHora.substring(0, 10);

        // Calcular cuándo terminaría el turno
        const finTurno = new Date(fecha);

        finTurno.setMinutes(
            finTurno.getMinutes() +
            Number(servicio.duracion)
        );

        // Verificar que el turno completo entre
        // dentro de alguno de los bloques de atención
        const turnoDentroDeHorario = horarios.some((horario) => {
            const inicioHorario = new Date(
                `${fechaTexto}T${horario.horaInicio}:00`
            );

            const finHorario = new Date(
                `${fechaTexto}T${horario.horaFin}:00`
            );

            return (
                fecha >= inicioHorario &&
                finTurno <= finHorario
            );
        });

        if (!turnoDentroDeHorario) {
            return res.status(400).json({
                error: "El turno está fuera del horario de atención",
            });
        }

        // Buscar turnos existentes ese día
        const inicioDia = new Date(
            `${fechaTexto}T00:00:00`
        );

        const finDia = new Date(
            `${fechaTexto}T23:59:59`
        );

        const turnosExistentes =
            await prisma.turno.findMany({
                where: {
                    fechaHora: {
                        gte: inicioDia,
                        lte: finDia,
                    },
                    estado: {
                        not: "CANCELADO",
                    },
                },
                include: {
                    servicio: true,
                },
            });

        // Verificar que no se superponga con otro turno
        const existeSuperposicion =
            turnosExistentes.some((turno) => {
                const inicioExistente =
                    new Date(turno.fechaHora);

                const finExistente =
                    new Date(turno.fechaHora);

                finExistente.setMinutes(
                    finExistente.getMinutes() +
                    Number(turno.servicio.duracion)
                );

                return (
                    fecha < finExistente &&
                    finTurno > inicioExistente
                );
            });

        if (existeSuperposicion) {
            return res.status(409).json({
                error: "El horario seleccionado ya está ocupado",
            });
        }

        // Crear el turno
        const turno = await prisma.turno.create({
            data: {
                fechaHora: fecha,
                estado: "PENDIENTE",
                observacion,
                usuarioId: usuarioIdNumero,
                servicioId: servicioIdNumero,
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        email: true,
                        telefono: true,
                    },
                },
                servicio: true,
            },
        });

        return res.status(201).json({
            mensaje: "Turno creado correctamente",
            turno,
        });
    } catch (error) {
        console.error("Error al crear turno:", error);

        return res.status(500).json({
            error: "No se pudo crear el turno",
        });
    }
};

// Cancelar turno
export const cancelarTurno = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: "El ID del turno no es válido",
            });
        }

        const turno = await prisma.turno.findUnique({
            where: {
                id,
            },
        });

        if (!turno) {
            return res.status(404).json({
                error: "El turno no existe",
            });
        }

        if (turno.estado === "CANCELADO") {
            return res.status(400).json({
                error: "El turno ya está cancelado",
            });
        }

        const turnoCancelado =
            await prisma.turno.update({
                where: {
                    id,
                },
                data: {
                    estado: "CANCELADO",
                },
            });

        return res.json({
            mensaje: "Turno cancelado correctamente",
            turno: turnoCancelado,
        });
    } catch (error) {
        console.error("Error al cancelar turno:", error);

        return res.status(500).json({
            error: "No se pudo cancelar el turno",
        });
    }
};

// Cambiar estado del turno
export const cambiarEstadoTurno = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);
        const { estado } = req.body;

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: "El ID del turno no es válido",
            });
        }

        const estadosPermitidos = [
            "PENDIENTE",
            "CONFIRMADO",
            "CANCELADO",
            "COMPLETADO",
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                error:
                    "Estado inválido. Estados permitidos: PENDIENTE, CONFIRMADO, CANCELADO, COMPLETADO",
            });
        }

        const turno = await prisma.turno.findUnique({
            where: {
                id,
            },
        });

        if (!turno) {
            return res.status(404).json({
                error: "El turno no existe",
            });
        }

        const turnoActualizado =
            await prisma.turno.update({
                where: {
                    id,
                },
                data: {
                    estado,
                },
            });

        return res.json({
            mensaje: "Estado actualizado correctamente",
            turno: turnoActualizado,
        });
    } catch (error) {
        console.error(
            "Error al cambiar estado del turno:",
            error
        );

        return res.status(500).json({
            error: "No se pudo actualizar el estado del turno",
        });
    }
};