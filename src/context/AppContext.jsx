import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tramiteActual, setTramiteActual] = useState(null);

  // Cargar estado de autenticación desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('arsa_user');
    const savedAuth = localStorage.getItem('arsa_authenticated');
    
    if (savedUser && savedAuth === 'true') {
      setUsuario(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Guardar estado de autenticación en localStorage
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('arsa_user', JSON.stringify(usuario));
      localStorage.setItem('arsa_authenticated', 'true');
    } else {
      localStorage.removeItem('arsa_user');
      localStorage.removeItem('arsa_authenticated');
    }
  }, [usuario]);

  const login = (userData) => {
    setUsuario(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUsuario(null);
    setIsAuthenticated(false);
    setTramiteActual(null);
    localStorage.removeItem('arsa_user');
    localStorage.removeItem('arsa_authenticated');
  };

  const iniciarTramite = (tramiteId, datosFormulario) => {
    setTramiteActual({
      id: tramiteId,
      datosFormulario,
      estado: 'en_proceso',
      fechaInicio: new Date().toISOString(),
    });
  };

  const completarTramite = () => {
    if (tramiteActual) {
      setTramiteActual({
        ...tramiteActual,
        estado: 'completado',
        fechaFin: new Date().toISOString(),
      });
    }
  };

  const value = {
    usuario,
    isAuthenticated,
    tramiteActual,
    login,
    logout,
    iniciarTramite,
    completarTramite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

