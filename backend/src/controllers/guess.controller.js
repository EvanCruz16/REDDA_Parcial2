import { evaluarIntento, reiniciarNumero } from "../services/guess.service.js";

const mensajes = {
  mayor: "El numero oculto es MAYOR",
  menor: "El numero oculto es MENOR",
  correcto: "Correcto! adivinaste el numero",
};

export const adivinar = (req, res, next) => {
  try {
    const { numero } = req.body ?? {};
    const resultado = evaluarIntento(numero);
    res.json({ resultado, mensaje: mensajes[resultado] });
  } catch (error) {
    next(error);
  }
};

export const reiniciar = (req, res, next) => {
  try {
    reiniciarNumero();
    res.json({ mensaje: "Nuevo numero generado, A jugar de nuevo!" });
  } catch (error) {
    next(error);
  }
};