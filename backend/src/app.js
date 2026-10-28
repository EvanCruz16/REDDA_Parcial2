import express from "express";
import cors from "cors";
import guessRoutes from "./routes/guess.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import reservaRoutes from "./routes/reserva.routes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.use("/", guessRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reserva", reservaRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const mensaje = err.status ? err.message : "Error interno del servidor";
    res.status(status).json({ error: mensaje });
});

export default app;