import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './simulacion.module.css';

const FaseEmision = () => {
  const [checks, setChecks] = useState([]);

  const verificaciones = [
    'Certificado generado',
    'PDF creado exitosamente',
  ];

  useEffect(() => {
    verificaciones.forEach((verificacion, index) => {
      setTimeout(() => {
        setChecks((prev) => [...prev, verificacion]);
      }, (index + 1) * 500);
    });
  }, []);

  return (
    <div className={styles.faseContent}>
      <div className={styles.faseIcon}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          📄
        </motion.div>
      </div>
      <ul className={styles.checksList}>
        {checks.map((check, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.checkItem}
          >
            <span className={styles.checkIcon}>✓</span>
            {check}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default FaseEmision;

