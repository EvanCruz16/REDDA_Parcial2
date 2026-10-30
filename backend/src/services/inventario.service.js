import { HttpError } from "./errores.js";

const menu = [
    { id: 101, nombre: "Menú Ejecutivo (Pollo)", precio: 5.5, stock: 12, categoria: "Fuerte" },
    { id: 102, nombre: "Pasta Alfredo", precio: 4.75, stock: 8, categoria: "Fuerte" },
    { id: 103, nombre: "Ensalada Cesar", precio: 3.25, stock: 10, categoria: "Entrada" },
    { id: 104, nombre: "Sopa de Res", precio: 3.0, stock: 6, categoria: "Entrada" },
    { id: 105, nombre: "Pastel de Chocolate", precio: 2.5, stock: 5, categoria: "Postre" },
    { id: 106, nombre: "Limonada Natural", precio: 1.5, stock: 0, categoria: "Bebida" },
];

let saldoMensual = 25.0;
let itemsReservados = [];
let expiraEn = null;
let reservaExpirada = false;

const redondear = (n) => Math.round(n * 100) / 100;

const buscarPlato = (id) => menu.find((plato) => plato.id === Number(id));

const calcularTotal = () =>
    redondear(
        itemsReservados.reduce(
            (acumulado, item) => acumulado + buscarPlato(item.id).precio * item.cantidad,
            0
        )
    );

const tiempoReservaMs = () => Number(process.env.RESERVA_SEGUNDOS || 300) * 1000;

const cerrarSiExpiro = () => {
    if (expiraEn === null || Date.now() < expiraEn) return false;
    itemsReservados.forEach((item) => {
        buscarPlato(item.id).stock += item.cantidad;
    });
    itemsReservados = [];
    expiraEn = null;
    reservaExpirada = true;
    return true;
};

const validarVigente = () => {
    if (cerrarSiExpiro()) {
        throw new HttpError(400, "Tu tiempo de reserva terminó. La reserva se cerró, inicia una nueva.");
    }
};

const validarCantidad = (cantidad) => {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
        throw new HttpError(400, "La cantidad debe ser un número entero mayor o igual a 1");
    }
};

const validarSaldo = (costoExtra) => {
    if (redondear(calcularTotal() + costoExtra) > saldoMensual) {
        throw new HttpError(400, "Saldo insuficiente para esta cantidad");
    }
};

export const obtenerMenu = () => menu.map((plato) => ({ ...plato }));

export const obtenerReserva = () => {
    cerrarSiExpiro();
    const total = calcularTotal();
    return {
        saldo: redondear(saldoMensual - total), // saldo disponible en tiempo real
        itemsReservados: itemsReservados.map((item) => ({ ...item })),
        total,
        segundosRestantes:
            expiraEn === null ? null : Math.max(0, Math.ceil((expiraEn - Date.now()) / 1000)),
        expirada: reservaExpirada,
    };
};

export const agregarPlato = (alimentoId, cantidad) => {
    validarVigente();
    validarCantidad(cantidad);

    const plato = buscarPlato(alimentoId);
    if (!plato) throw new HttpError(404, "Plato no encontrado");
    if (plato.stock < cantidad) throw new HttpError(400, "Stock insuficiente");
    validarSaldo(plato.precio * cantidad);

    plato.stock -= cantidad; // se bloquea el stock

    const existente = itemsReservados.find((item) => item.id === plato.id);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        itemsReservados.push({ id: plato.id, cantidad });
    }

    if (expiraEn === null) expiraEn = Date.now() + tiempoReservaMs();
    reservaExpirada = false;

    return obtenerReserva();
};

export const actualizarPorciones = (id, nuevaCantidad) => {
    validarVigente();
    validarCantidad(nuevaCantidad);

    const item = itemsReservados.find((i) => i.id === Number(id));
    if (!item) throw new HttpError(404, "El plato no esta en tu reserva");

    const plato = buscarPlato(id);
    const diferencia = nuevaCantidad - item.cantidad;

    if (diferencia > 0) {
        if (plato.stock < diferencia) throw new HttpError(400, "Stock insuficiente");
        validarSaldo(plato.precio * diferencia);
    }

    plato.stock -= diferencia;
    item.cantidad = nuevaCantidad;

    return obtenerReserva();
};

export const eliminarPlato = (id) => {
    validarVigente();

    const item = itemsReservados.find((i) => i.id === Number(id));
    if (!item) throw new HttpError(404, "El plato no esta en tu reserva");

    buscarPlato(id).stock += item.cantidad;
    itemsReservados = itemsReservados.filter((i) => i.id !== item.id);
    if (itemsReservados.length === 0) expiraEn = null;

    return obtenerReserva();
};

export const confirmarReserva = () => {
    validarVigente();
    if (itemsReservados.length === 0) {
        throw new HttpError(400, "No tienes platos en tu reserva");
    }

    const totalPagado = calcularTotal();
    saldoMensual = redondear(saldoMensual - totalPagado);
    itemsReservados = [];

    return { mensaje: "Reserva confirmada con éxito", totalPagado, saldo: saldoMensual };
};