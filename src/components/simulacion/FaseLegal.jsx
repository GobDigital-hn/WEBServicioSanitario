import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './simulacion.module.css';

const FaseLegal = () => {
  const [checks, setChecks] = useState([]);

  const verificaciones = [
    'Documentos legales verificados',
    'Cumplimiento normativo confirmado',
    'Autorización legal otorgada',
  ];

  useEffect(() => {
    verificaciones.forEach((verificacion, index) => {
      setTimeout(() => {
        setChecks((prev) => [...prev, verificacion]);
      }, (index + 1) * 700);
    });
  }, []);

  return (
    <div className={styles.faseContent}>
      <div className={styles.faseIcon}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          ✓
        </motion.div>
      </div>
      <ul className={styles.checksList}>
        <AnimatePresence>
          {checks.map((check, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.checkItem}
            >
              <span className={styles.checkIcon}>✓</span>
              {check}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default FaseLegal;

