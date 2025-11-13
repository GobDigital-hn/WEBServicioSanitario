import React from 'react';
import styles from './ui.module.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  return <div className={`${styles.spinner} ${styles[`spinner-${size}`]}`} />;
};

export default LoadingSpinner;

