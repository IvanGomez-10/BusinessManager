import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Table, Form } from 'react-bootstrap';
import './Empleados.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [editableObservaciones, setEditableObservaciones] = useState("");

  const [newEmpleado, setNewEmpleado] = useState({
    Id: '',
    Nombre: '',
    Edad: '',
    Posicion: '',
    Habilidades: '',
    Observaciones: '',
  });

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch('http://localhost:5267/api/Empleados');
        const data = await response.json();
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

  const handleShowDetailsModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setEditableObservaciones(empleado.observaciones);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => setShowDetailsModal(false);

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmpleado({ ...newEmpleado, [name]: value });
  };

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
        setNewEmpleado({ Nombre: '', Edad: '', Posicion: '', Habilidades: '', Observaciones: '' });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al añadir empleado:", error);
    }
  };

  const handleDeleteEmpleado = async (id) => {
    try {
      const response = await fetch(`http://localhost:5267/api/Empleados/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setEmpleados(empleados.filter((empleado) => empleado.id !== id));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  // Maneja la actualización de observaciones en la base de datos
  const handleUpdateObservaciones = async () => {
    try {
      const response = await fetch(`http://localhost:5267/api/Empleados/update/${selectedEmpleado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observaciones: editableObservaciones }),
      });
      const data = await response.json();

      if (data.success) {
        setEmpleados(empleados.map((empleado) =>
          empleado.id === selectedEmpleado.id ? { ...empleado, observaciones: editableObservaciones } : empleado
        ));
        setShowDetailsModal(false);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al actualizar observaciones:", error);
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.nombre}</td>
                <td>{empleado.edad}</td>
                <td>{empleado.posicion}</td>
                <td>{empleado.habilidades}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowDetailsModal(empleado)}>
                    Ver detalles
                  </Button>{' '}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteEmpleado(empleado.id)}
                  >
                    Eliminar
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
              <p><strong>Edad:</strong> {selectedEmpleado.edad}</p>
              <p><strong>Puesto:</strong> {selectedEmpleado.posicion}</p>
              <p><strong>Aptitudes:</strong> {selectedEmpleado.habilidades}</p>
              <Form.Group>
                <Form.Label className="label-observaciones">Observaciones:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editableObservaciones}
                  onChange={(e) => setEditableObservaciones(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdateObservaciones}>
            Actualizar
          </Button>
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
                name="Nombre"
                value={newEmpleado.Nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                name="Edad"
                value={newEmpleado.Edad}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Puesto</Form.Label>
              <Form.Control
                type="text"
                name="Posicion"
                value={newEmpleado.Posicion}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Aptitudes</Form.Label>
              <Form.Control
                type="text"
                name="Habilidades"
                value={newEmpleado.Habilidades}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="Observaciones"
                value={newEmpleado.Observaciones}
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
