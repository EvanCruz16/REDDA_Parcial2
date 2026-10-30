import { HttpError } from "./errores.js";

const generarNumeroAleatorio = () => Math.floor(Math.random() * 100) + 1;

let numeroOculto = generarNumeroAleatorio();


export const evaluarIntento = (numero) => {
    if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
        throw new HttpError(400, "Envía un número entero entre 1 y 100");
    }
    if (numero < numeroOculto) return "mayor";
    if (numero > numeroOculto) return "menor";
    return "correcto";
};

export const reiniciarNumero = () => {
    numeroOculto = generarNumeroAleatorio();
};