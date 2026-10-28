import {
    obtenerReserva,
    agregarPlato,
    actualizarPorciones,
    eliminarPlato,
    confirmarReserva,
} from "../services/inventario.service.js";

export const verReserva = (req, res, next) => {
    try {
        res.json(obtenerReserva());
    } catch (error) {
        next(error);
    }
};

export const agregar = (req, res, next) => {
    try {
        const { alimentoId, cantidad } = req.body ?? {};
        res.status(201).json(agregarPlato(alimentoId, cantidad));
    } catch (error) {
        next(error);
    }
};

export const actualizar = (req, res, next) => {
    try {
        const { cantidad } = req.body ?? {};
        res.json(actualizarPorciones(req.params.id, cantidad));
    } catch (error) {
        next(error);
    }
};

export const eliminar = (req, res, next) => {
    try {
        res.json(eliminarPlato(req.params.id));
    } catch (error) {
        next(error);
    }
};

export const confirmar = (req, res, next) => {
    try {
        res.json(confirmarReserva());
    } catch (error) {
        next(error);
    }
};