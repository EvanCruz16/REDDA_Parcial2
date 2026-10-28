import { obtenerMenu } from "../services/inventario.service.js";

export const listarMenu = (req, res, next) => {
    try {
        res.json(obtenerMenu());
    } catch (error) {
        next(error);
    }
};