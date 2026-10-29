import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PanelSuperior from './pages/PanelSuperior';
import CarritoReserva from './pages/CarritoReserva';
import CatalogoMenu from './pages/CatalogoMenu';

const API_URL = 'http://localhost:3005/api';

const Dashboard = () => {
  const [reserva, setReserva] = useState({
    saldo: 25.0,
    itemsReservados: [],
    total: 0
  });
  const [errorGlobal, setErrorGlobal] = useState(null);

  //consumir get/api/reserva
  const cargarReserva = async () => {
    try { 
      const res = await axios.get(`${API_URL}/reserva`);
      setReserva(res.data);
    } catch (err) {
      setErrorGlobal("Error cargando la reserva :(");
    }
  };

  useEffect(() => {
    cargarReserva();
  }, []);

  //consumir put/api/reserva/actualizar-porciones/:id
  const actualizarPorciones = async (id, nuevaCantidad) => {
    try {
      setErrorGlobal(null);
      const res = await axios.put(`${API_URL}/reserva/actualizar-porciones/${id}`, {cantidad: nuevaCantidad});
      setReserva(res.data);
    } catch (err) {
      setErrorGlobal(err.response?.data?.error || "Error al actualizaar");
    }
  };

  //consumir delete/api/reserva/eliminar/:id
  const eliminarItem = async (id) => {
    try {
      setErrorGlobal(null);
      const res = await axios.delete('${API_URL}/reserva/eliminar/${id}');
      setReserva(res.data);
    } catch (err) {
      setErrorGlobal(err.response?.data?.error || "Error eliminando");
    }
  };

  return (
    <div className="container-fluid p-0">
      <PanelSuperior 
        saldo={reserva.saldo} 
        totalReserva={reserva.total}
        error={errorGlobal} 
      />
      
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
             {/*para mostrar el menu*/}
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
};

export default App;
