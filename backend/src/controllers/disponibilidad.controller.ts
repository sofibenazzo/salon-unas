import "dotenv/config";

import { Request, Response } from "express";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/client.js";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

export const obtenerDisponibilidad = async (
    req: Request,
    res: Response
) => {
    try {
        const servicioId = Number(req.query.servicioId);
        const fecha = String(req.query.fecha);

        if (!Number.isInteger(servicioId)) {
            return res.status(400).json({
                error: "El servicio es obligatorio y debe ser válido",
            });
        }

        if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return res.status(400).json({
                error: "La fecha debe tener el formato YYYY-MM-DD",
            });
        }

        const servicio = await prisma.servicio.findUnique({
            where: {
                id: servicioId,
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

        const fechaSeleccionada = new Date(
            `${fecha}T00:00:00`
        );

        if (Number.isNaN(fechaSeleccionada.getTime())) {
            return res.status(400).json({
                error: "La fecha no es válida",
            });
        }

        const diaSemana =
            fechaSeleccionada.getDay() === 0
                ? 7
                : fechaSeleccionada.getDay();

        const horario =
            await prisma.horarioAtencion.findFirst({
                where: {
                    diaSemana,
                    activo: true,
                },
                orderBy: {
                    horaInicio: "asc",
                },
            });

        if (!horario) {
            return res.json({
                fecha,
                servicioId,
                horariosDisponibles: [],
            });
        }

        const inicioDia = new Date(`${fecha}T00:00:00`);
        const finDia = new Date(`${fecha}T23:59:59`);

        const turnos = await prisma.turno.findMany({
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
            orderBy: {
                fechaHora: "asc",
            },
        });

        const inicioHorario = new Date(
            `${fecha}T${horario.horaInicio}:00`
        );

        const finHorario = new Date(
            `${fecha}T${horario.horaFin}:00`
        );

        const duracionServicio = Number(servicio.duracion);

        const horariosDisponibles: string[] = [];

        for (
            let hora = new Date(inicioHorario);
            hora < finHorario;
            hora.setMinutes(hora.getMinutes() + 15)
        ) {
            const inicioTurno = new Date(hora);

            const finTurno = new Date(hora);

            finTurno.setMinutes(
                finTurno.getMinutes() + duracionServicio
            );

            if (finTurno > finHorario) {
                continue;
            }

            const ahora = new Date();

            if (
                fecha === ahora.toISOString().slice(0, 10) &&
                inicioTurno <= ahora
            ) {
                continue;
            }

            const ocupado = turnos.some((turno) => {
                const inicioExistente =
                    new Date(turno.fechaHora);

                const finExistente =
                    new Date(turno.fechaHora);

                finExistente.setMinutes(
                    finExistente.getMinutes() +
                    Number(turno.servicio.duracion)
                );

                return (
                    inicioTurno < finExistente &&
                    finTurno > inicioExistente
                );
            });

            if (!ocupado) {
                horariosDisponibles.push(
                    inicioTurno
                        .toTimeString()
                        .slice(0, 5)
                );
            }
        }

        return res.json({
            fecha,
            servicioId,
            servicio: {
                id: servicio.id,
                nombre: servicio.nombre,
                duracion: servicio.duracion,
            },
            horarioAtencion: {
                inicio: horario.horaInicio,
                fin: horario.horaFin,
            },
            horariosDisponibles,
        });
    } catch (error) {
        console.error(
            "Error al obtener disponibilidad:",
            error
        );

        return res.status(500).json({
            error: "No se pudo obtener la disponibilidad",
        });
    }
}; 