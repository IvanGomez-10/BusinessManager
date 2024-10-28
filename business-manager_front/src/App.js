import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/LogIn/Login';
import Home from './components/Home/Home';
import Empleados from './components/Empleados/Empleados';
import Menu from './components/Menu/Menu';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const location = useLocation();

  return (
    <>
      {/* Renderizar el menú solo si la ruta no es '/' */}
      {location.pathname !== '/' && <Menu />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/empleados" element={<Empleados />} />
      </Routes>
    </>
  );
}

// Crear un componente AppWrapper para que use la ubicación
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
