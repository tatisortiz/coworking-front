import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row, Container, Card } from 'react-bootstrap';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Para alternar entre login y registro
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    startUp: '',
    email: '',
    dni: '',
    phone: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const { email, password } = formData;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
          email,
          password
        });
        localStorage.setItem('token', response.data.token);
        navigate('/rooms');
      } catch (error) {
        setError(error.response.data.msg);
      }
    } else {
      try {
        const { firstName, lastName, startUp, email, dni, phone, password } = formData;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
          firstName,
          lastName,
          startUp,
          email,
          dni,
          phone,
          password
        });
        localStorage.setItem('token', response.data.token);
        navigate('/rooms');
      } catch (error) {
        setError(error.response.data.msg);
      }
      console.log('Registro:', formData);
    }
  };

  const toggleAuthMode = () => {
    setError('');
    setIsLogin(!isLogin); // Cambiar entre login y registro
    setFormData({
      firstName: '',
      lastName: '',
      startUp: '',
      email: '',
      dni: '',
      phone: '',
      password: '',
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2>{isLogin ? 'Login' : 'Registro'}</h2>
              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <Form.Group controlId="formFirstName">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Introduce tu nombre"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formLastName">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Introduce tu apellido"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    </Form.Group>
                  </>
                )}

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Introduce tu email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {!isLogin && (
                  <>
                    <Form.Group controlId="formStartUp">
                      <Form.Label>Empresa</Form.Label>
                      <Form.Control
                        type="text"
                        name="startUp"
                        placeholder="Introduce tu empresa"
                        value={formData.startUp}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formDNI">
                      <Form.Label>DNI</Form.Label>
                      <Form.Control
                        type="number"
                        name="dni"
                        placeholder="Introduce tu DNI"
                        value={formData.dni}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formPhone">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="number"
                      name="phone"
                      placeholder="Introduce tu teléfono"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    </Form.Group>
                  </>
                )}

                <Form.Group controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Introduce tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                  {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </Button>
              </Form>
              <Button variant="link" onClick={toggleAuthMode} className="mt-3">
                {isLogin
                  ? '¿No tienes cuenta? Regístrate aquí'
                  : '¿Ya tienes cuenta? Inicia sesión aquí'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <p className='text-center mt-2 text-danger font-weight-bold'>{error}</p>
    </Container>
  );
};

export default LoginPage;