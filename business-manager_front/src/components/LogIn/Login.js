import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook para redireccionar

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Si el inicio de sesión es exitoso, redirige a /home
      console.log('Login exitoso!', token);
      navigate('/home'); // Redirección a Home
    } catch (error) {
      setErrorMessage('Error durante el inicio de sesión: ' + error.message);
    }
  };

  return (
    <Container className="login-container">
      <Row className="login-box">
        <Col>
          <h2 className="login-title">Iniciar Sesión</h2>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Introduce tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="login-button">
              Iniciar Sesión
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
