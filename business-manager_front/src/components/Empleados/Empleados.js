// src/components/Empleados.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Table, Form } from 'react-bootstrap';
import './Empleados.css';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [newEmpleado, setNewEmpleado] = useState({
    nombre: '',
    edad: '',
    posicion: '',
    habilidades: '',
    observaciones: '',
  });

  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Llamada a la API para cargar los empleados desde Firestore
    const fetchEmpleados = async () => {
      try {
        const response = await fetch('http://localhost:5267/api/Empleados');
        const data = await response.json();
        console.log("Datos obtenidos del backend:", data);
        if (data.success) {
          setEmpleados(data.empleados);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
      }
    };

    fetchEmpleados();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleShowDetailsModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => setShowDetailsModal(false);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  // Maneja el cambio en el formulario de nuevo empleado
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmpleado({ ...newEmpleado, [name]: value });
  };

  // Llamada a la API para insertar un nuevo empleado
  const handleAddEmpleado = async () => {
    try {
      const response = await fetch('http://localhost:5267/api/Empleados/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmpleado),
      });
      const data = await response.json();
      
      if (data.success) {
        setEmpleados([...empleados, { ...newEmpleado, id: data.id }]);
        handleCloseAddModal();
        setNewEmpleado({ nombre: '', edad: '', posicion: '', habilidades: '', observaciones: '' });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir empleado:", error);
    }
  };

  return (
    <Container className="empleados-container">
      <Row className="mb-4">
        <Col className="text-center">
          <h2>Gestión de Empleados</h2>
          <Button variant="success" onClick={handleShowAddModal}>
            Añadir Empleado
          </Button>
        </Col>
      </Row>

      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Puesto</th>
              <th>Aptitudes</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.nombre}</td>
                <td>{empleado.edad}</td>
                <td>{empleado.posicion}</td>
                <td>{empleado.habilidades}</td>
                <td>{empleado.observaciones}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowDetailsModal(empleado)}>
                    Ver detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>

      {/* Modal para mostrar detalles del empleado */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmpleado && (
            <>
              <p><strong>ID:</strong> {selectedEmpleado.id}</p>
              <p><strong>Nombre:</strong> {selectedEmpleado.nombre}</p>
              <p><strong>Posición:</strong> {selectedEmpleado.posicion}</p>
              <p><strong>Edad:</strong> {selectedEmpleado.edad}</p>
              <p><strong>Aptitudes:</strong> {selectedEmpleado.habilidades}</p>
              <p><strong>Observaciones:</strong> {selectedEmpleado.observaciones}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para añadir un nuevo empleado */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nuevo Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newEmpleado.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                name="edad"
                value={newEmpleado.edad}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Puesto</Form.Label>
              <Form.Control
                type="text"
                name="posicion"
                value={newEmpleado.posicion}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Aptitudes</Form.Label>
              <Form.Control
                type="text"
                name="habilidades"
                value={newEmpleado.habilidades}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="observaciones"
                value={newEmpleado.observaciones}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddEmpleado}>
            Añadir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Empleados;
