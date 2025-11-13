import React from 'react';
import styles from './ui.module.css';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[`button-${variant}`]} ${styles[`button-${size}`]} ${fullWidth ? styles.buttonFullWidth : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;

