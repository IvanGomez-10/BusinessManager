import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToStock = () => {
    navigate('/inventario');
  };

  const goToEmpleados = () => {
    navigate('/empleados');
  };

  const goToTienda = () => {
    navigate('/tienda');
  };

  return (
    <Container className="home-container">
      <Row>
        <Col>
          <h1 className="home-title">Bienvenido</h1>
          <p className="home-subtitle">¿Qué deseas hacer?</p>
          <Button variant="secondary" className="home-button" onClick={goToDashboard}>
            Dashboard
          </Button>
          <Button variant="primary" className="home-button" onClick={goToEmpleados}>
            Gestión de empleados
          </Button>
          <Button variant="secondary" className="home-button" onClick={goToStock}>
            Gestor de inventario
          </Button>
          <Button variant="secondary" className="home-button" onClick={goToTienda}>
            Tienda
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
