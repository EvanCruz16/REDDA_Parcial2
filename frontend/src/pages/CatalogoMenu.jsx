import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardText, Badge, Button } from 'reactstrap';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

const CatalogoMenu = ({ actualizarReservaGlobal, setErrorGlobal }) => {
    const [menu, setMenu] = useState([]); //crea una variable para que see actualice con las diferentes comidas.
    const cargarMenu = async () => {
        try {
            const res = await axios.get(`${API_URL}/menu`); //hace la peticion al endpoint y espera a que el servidor responda
            setMenu(res.data); //guarda el listado de la comida del menu
        } catch (err) {
            setErrorGlobal("Error al cargar el menu");
        }
    };

    useEffect(() => {
        cargarMenu(); //trae la comida al servidor
    }, []);

    //agregar plato a la reserva(ocupar el endpoint 3)
    const agregarAReserva = async (alimentoId) => {
        try {
            setErrorGlobal(null);
            const res = await axios.post(`${API_URL}/reserva/agregar`, { //envia peticion al endpoint
                alimentoId: alimentoId,
                cantidad: 1
            });

            //actualizar el menu y estado de la reserva:
            cargarMenu(); //consulta al menu para actualizar el stock que ve el usuario
            if (actualizarReservaGlobal) { //mostrara el saldo y total de la reserva que se realizo
                actualizarReservaGlobal(res.data);
            }
        } catch (err) {
            setErrorGlobal(err.response?.data.error || "Error al añadir el platillo elegida a la reserva ");
        }
    };

    return (
        //diseño del titulo
        <div>
            <h3 className="mb-4 fw-bold text-dark">Menú del Día</h3>
            <Row>
                {menu.map((plato) => (
                    <Col md="4" xs="12" key={plato.id} className="d-flex align-items-stretch">
                        <Card className="mb-3 w-100 shadow-sm">
                            <CardBody className="d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <CardTitle tag="h5" className="fw-bold mb-0">{plato.nombre}</CardTitle>
                                        <Badge color="info" pill>{plato.categoria}</Badge>
                                    </div>

                                    <CardText className="text-muted small mb-3">
                                        Stock disponible: <strong>{plato.stock}</strong> porciones
                                    </CardText>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                                    <Badge color="success" className="fs-6 px-3 py-2">
                                        ${Number(plato.precio).toFixed(2)}
                                    </Badge>

                                    {plato.stock === 0 ? (
                                        <Button color="secondary" disabled size="sm">
                                            Agotado
                                        </Button>
                                    ) : (
                                        <Button

                                            color="primary"
                                            className="px-2 py-1 text-nowrap"
                                            onClick={() => agregarAReserva(plato.id)}
                                        >
                                            Añadir a la Reserva
                                        </Button>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))
                }
            </Row >
        </div >
    );
};

export default CatalogoMenu;
