import { Request, Response, NextFunction } from "express";

export const soloAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.usuario) {
        return res.status(401).json({
            error: "Usuario no autenticado",
        });
    }

    if (req.usuario.rol !== "ADMIN") {
        return res.status(403).json({
            error: "Acceso permitido únicamente a administradores",
        });
    }

    next();
};