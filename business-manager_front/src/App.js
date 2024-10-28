import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LogIn/Login';
import Home from './components/Home/Home';
import Empleados from './components/Empleados/Empleados';
import Menu from './components/Menu/Menu';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/empleados" element={<Empleados />} />
      </Routes>
    </Router>
  );
}

export default App;
