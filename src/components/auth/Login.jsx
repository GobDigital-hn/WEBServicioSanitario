import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import styles from './Login.module.css';
const logoArsa = '/LogoArsa.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación básica
    if (!formData.usuario || !formData.password) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }

    // Simulación de autenticación
    // Nota: La validación de credenciales se realiza en el backend
    setTimeout(() => {
      const userData = {
        nombre: 'Ariel Lutz',
        email: 'ariellutz10@gmail.com',
        usuario: formData.usuario,
        isAuthenticated: true,
      };

      login(userData);
      setLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img src={logoArsa} alt="Logo ARSA" className={styles.logo} />
        </div>
        
        <h1 className={styles.title}>Portal Ciudadano ARSA</h1>
        <p className={styles.subtitle}>Sistema de Gestión de Trámites</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="usuario" className={styles.label}>
              Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ingrese su usuario"
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ingrese su contraseña"
              disabled={loading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className={styles.note}>
          Este es un prototipo. Puede ingresar con cualquier credencial.
        </p>
      </div>
    </div>
  );
};

export default Login;

