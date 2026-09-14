import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            usuario?: {
                id: number;
                email: string;
                rol: string;
            };
        }
    }
}

export { };