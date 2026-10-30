import { Router } from "express";
import {
    verReserva,
    agregar,
    actualizar,
    eliminar,
    confirmar,
} from "../controllers/reserva.controller.js";

const router = Router();

router.get("/", verReserva);
router.post("/agregar", agregar);
router.put("/actualizar-porciones/:id", actualizar);
router.delete("/eliminar/:id", eliminar);
router.post("/confirmar", confirmar);

export default router;