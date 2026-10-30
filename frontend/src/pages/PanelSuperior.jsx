import React from "react";
import { Navbar, Badge, UncontrolledAlert } from 'reactstrap';

const PanelSuperior = ({ saldo, totalReserva, error }) => {
    return (
        <>
        {error && (
            <UncontrolledAlert color="warning" className="m-0 text-center fw-bold rounded-0">
                {error}
            </UncontrolledAlert>
        )}

        <Navbar color="info" dark expand="md" className="px-4 shadow-sm">
            <div className="ms-auto text-white d-flex gap-4">
            <span className="fs-5">
                Tu saldo actual es: ${saldo.toFixed(2)}
            </span>
            <span className="fs-5">
                El total de la reserva es: <Badge color="dark" pill>${totalReserva.toFixed(2)}</Badge>
            </span>
            </div>
        </Navbar>
        </>
    );
};

export default PanelSuperior;