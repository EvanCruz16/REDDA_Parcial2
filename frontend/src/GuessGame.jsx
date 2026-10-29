
import { useState } from 'react';
import axios from 'axios';
import './GuessGame.css';

const API_URL = 'http://localhost:3005';

function GuessGame() {
  const [numero, setNumero] = useState('');
  const [intentos, setIntentos] = useState([]);
  const [mensaje, setMensaje] = useState(
    'Introduce un número entre 1 y 100.'
  );
  const [ganaste, setGanaste] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const adivinarNumero = async (e) => {
    e.preventDefault();

    if (numero === '' || Number(numero) < 1 || Number(numero) > 100) {
      setError('Introduce un número entre 1 y 100.');
      return;
    }

    if (!Number.isInteger(Number(numero))) {
      setError('Debes introducir un número entero.');
      return;
    }

    if (ganaste || cargando) return;

    const valor = Number(numero);

    if (intentos.some((intento) => intento.numero === valor)) {
      setError('Ya intentaste ese número. Prueba con otro.');
      return;
    }

    setError('');
    setCargando(true);

    try {
      const respuesta = await axios.post(`${API_URL}/guess`, {
        numero: valor,
      });

      const resultado = respuesta.data.resultado;
      const nuevoIntento = {
        numero: valor,
        resultado,
        mensaje: respuesta.data.mensaje,
      };

      setIntentos((anteriores) => [...anteriores, nuevoIntento]);
      setMensaje(respuesta.data.mensaje);

      if (resultado === 'correcto') {
        setGanaste(true);
      }

      setNumero('');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'No se pudo conectar con el servidor. Comprueba que el backend esté funcionando.'
      );
    } finally {
      setCargando(false);
    }
  };

  const reiniciarJuego = async () => {
    setCargando(true);
    setError('');

    try {
      const respuesta = await axios.post(`${API_URL}/reset`);

      setNumero('');
      setIntentos([]);
      setGanaste(false);
      setMensaje(
        respuesta.data.mensaje || 'Nuevo juego. Inténtalo otra vez'
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'No se pudo reiniciar el juego. Comprueba el servidor.'
      );
    } finally {
      setCargando(false);
    }
  };

  const intentosFallidos = intentos.filter(
    (intento) => intento.resultado !== 'correcto'
  ).length;

  return (
    <main className="juego-fondo">
      <section className="juego-tarjeta">
        <div className="juego-encabezado">
          <span className="juego-etiqueta">RETO NUMÉRICO</span>
          <h1>Adivina el número</h1>
          <p>
            Estoy pensando en un número del 1 al 100.
            ¿Puedes adivinar qué número es?
          </p>
        </div>

        <div className="juego-estadisticas">
          <div className="estadistica">
            <span>Intentos realizados</span>
            <strong>{intentos.length}</strong>
          </div>

          <div className="estadistica">
            <span>Intentos fallidos</span>
            <strong>{intentosFallidos}</strong>
          </div>
        </div>

        <div
          className={`juego-mensaje ${ganaste ? 'mensaje-exito' : ''}`}
          role="status"
          aria-live="polite"
        >
          {mensaje}
        </div>

        {error && (
          <div className="juego-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={adivinarNumero}>
          <label htmlFor="numero">Tu número</label>

          <input
            id="numero"
            type="number"
            min="1"
            max="100"
            step="1"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ej. 42"
            disabled={ganaste || cargando}
          />

          <button
            className="boton-adivinar"
            type="submit"
            disabled={ganaste || cargando}
          >
            {cargando ? 'Procesando...' : 'Adivinar'}
          </button>
        </form>

        {ganaste && (
          <div className="juego-victoria">
            Felicidades, Adivinaste el número.
          </div>
        )}

        <button
          className="boton-reiniciar"
          type="button"
          onClick={reiniciarJuego}
          disabled={cargando}
        >
          Reiniciar partida
        </button>

        <section className="historial">
          <h2>Historial de intentos</h2>

          {intentos.length === 0 ? (
            <p className="historial-vacio">
              Todavía no has realizado ningún intento.
            </p>
          ) : (
            <ul>
              {[...intentos].reverse().map((intento, indice) => (
                <li
                  key={`${intento.numero}-${indice}`}
                  className={
                    intento.resultado === 'correcto'
                      ? 'intento-correcto'
                      : 'intento-fallido'
                  }
                >
                  <span>Número: {intento.numero}</span>
                  <strong>{intento.mensaje}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="juego-pie">
          Cada intento cuenta. Sigue probando.
        </p>
      </section>
    </main>
  );
}

export default GuessGame;
