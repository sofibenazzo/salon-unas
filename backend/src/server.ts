import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import serviciosRoutes from "./routes/servicios.routes.js";
import horariosRoutes from "./routes/horarios.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import disponibilidadRoutes from "./routes/disponibilidad.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/disponibilidad", disponibilidadRoutes);
app.use("/api/turnos", turnosRoutes);

app.get("/", (_req, res) => {
    res.json({
        message: "API del salón de uñas",
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Servidor backend ejecutándose en http://localhost:${PORT}`
    );
});