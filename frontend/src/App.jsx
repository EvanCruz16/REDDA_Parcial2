
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GuessGame from './GuessGame';
import PanelSuperior from './pages/PanelSuperior';
import CarritoReserva from './pages/CarritoReserva';
import CatalogoMenu from './pages/CatalogoMenu';

const API_URL = 'http://localhost:3005/api';

function App() {
  const [vista, setVista] = useState('inicio');

  const [reserva, setReserva] = useState({
    saldo: 25.0,
    itemsReservados: [],
    total: 0
  });

  const [errorGlobal, setErrorGlobal] = useState(null);

  const cargarReserva = async () => {
    try {
      const res = await axios.get(`${API_URL}/reserva`);
      setReserva(res.data);
    } catch (err) {
      setErrorGlobal('Error cargando la reserva');
    }
  };

  useEffect(() => {
    if (vista === 'catalogo') {
      cargarReserva();
    }
  }, [vista]);

  const actualizarPorciones = async (id, nuevaCantidad) => {
    try {
      setErrorGlobal(null);
      const res = await axios.put(
        `${API_URL}/reserva/actualizar-porciones/${id}`,
        { cantidad: nuevaCantidad }
      );
      setReserva(res.data);
    } catch (err) {
      setErrorGlobal(
        err.response?.data?.error || 'Error al actualizar'
      );
    }
  };

  const eliminarItem = async (id) => {
    try {
      setErrorGlobal(null);
      const res = await axios.delete(
        `${API_URL}/reserva/eliminar/${id}`
      );
      setReserva(res.data);
    } catch (err) {
      setErrorGlobal(
        err.response?.data?.error || 'Error eliminando'
      );
    }
  };

  if (vista === 'juego') {
    return (
      <div className="container mt-4">
        <button
          className="btn btn-secondary mb-3"
          onClick={() => setVista('inicio')}
        >
          Volver al menú
        </button>
        <GuessGame />
      </div>
    );
  }

  if (vista === 'catalogo') {
    return (
      <div className="container-fluid p-0">
        <button
          className="btn btn-secondary m-3"
          onClick={() => setVista('inicio')}
        >
          Volver al menú
        </button>

        <PanelSuperior
          saldo={reserva.saldo}
          totalReserva={reserva.total}
          error={errorGlobal}
        />

        <div className="container mt-4">
          <div className="row">
            <div className="col-md-8">
              <CatalogoMenu
                actualizarReservaGlobal={setReserva}
                setErrorGlobal={setErrorGlobal}
              />
            </div>

            <div className="col-md-4">
              <CarritoReserva
                items={reserva.itemsReservados}
                actualizarPorciones={actualizarPorciones}
                eliminarItem={eliminarItem}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container mt-5">
      <h1>Menú principal</h1>
      <p>Selecciona la funcionalidad que deseas utilizar.</p>

      <div className="d-flex gap-3 flex-wrap">
        <button
          className="btn btn-primary"
          onClick={() => setVista('juego')}
        >
          Juego Adivina el Número
        </button>

        <button
          className="btn btn-success"
          onClick={() => setVista('catalogo')}
        >
          Catálogo y reservas
        </button>
      </div>
    </main>
  );
}

export default App;
