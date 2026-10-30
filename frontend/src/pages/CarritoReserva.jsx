import React from 'react';
import { ListGroup, ListGroupItem, Button, ButtonGroup } from 'reactstrap';

const CarritoReserva = ({ items, actualizarPorciones, eliminarItem }) => {
  return (
    <div className="border rounded p-3 shadow-sm bg-white">
      <h5 className="mb-3 fw-bold">Reserva Actual</h5>
      
      <ListGroup>
        {items.map((item) => (
          <ListGroupItem key={item.id} className="d-flex flex-column gap-2 px-2 py-3">
            <span className="fw-bold">Platillo ID: {item.id}</span>
            
            <div className="d-flex justify-content-between align-items-center mt-2">
              <ButtonGroup size="sm">
                <Button 
                  color="secondary" outline 
                  onClick={() => actualizarPorciones(item.id, item.cantidad - 1)}
                > - </Button>
                
                <Button disabled color="light" className="text-dark fw-bold px-3">
                  {item.cantidad}
                </Button>
                
                <Button 
                  color="secondary" outline 
                  onClick={() => actualizarPorciones(item.id, item.cantidad + 1)}
                > + </Button>
              </ButtonGroup>
              <Button 
                color="danger" 
                outline 
                size="sm" 
                onClick={() => eliminarItem(item.id)}
              >
                Quitar
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default CarritoReserva;