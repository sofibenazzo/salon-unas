import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
    id: number;
    email: string;
    rol: string;
}

export const autenticar = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Token de autenticación requerido",
            });
        }

        const [tipo, token] = authHeader.split(" ");

        if (tipo !== "Bearer" || !token) {
            return res.status(401).json({
                error: "Formato de token inválido",
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                error: "JWT_SECRET no está configurado",
            });
        }

        const payload = jwt.verify(token, secret) as TokenPayload;

        req.usuario = payload;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Token inválido o expirado",
        });
    }
};