import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MenuPrincipal from './components/dashboard/MenuPrincipal';
import FormularioSolicitud from './components/formulario/FormularioSolicitud';
import './styles/globals.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MenuPrincipal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tramite/:id"
            element={
              <ProtectedRoute>
                <FormularioSolicitud />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

