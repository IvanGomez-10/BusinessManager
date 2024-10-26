import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Archivo CSS para estilos adicionales

const Home = () => {
  const navigate = useNavigate();

  const goToTasks = () => {
    // Aquí navegarás al componente Gestor de tareas
    navigate('/tasks');
  };

  const goToEmployees = () => {
    // Aquí navegarás al componente Gestión de empleados
    navigate('/employees');
  };

  return (
    <Container className="home-container d-flex align-items-center justify-content-center min-vh-100">
      <Row>
        <Col className="text-center">
          <h1>Bienvenido</h1>
          <p>Selecciona una opción para continuar</p>
          <Button variant="primary" className="home-button" onClick={goToTasks}>
            Gestor de Tareas
          </Button>
          <Button variant="secondary" className="home-button" onClick={goToEmployees}>
            Gestión de Empleados
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
