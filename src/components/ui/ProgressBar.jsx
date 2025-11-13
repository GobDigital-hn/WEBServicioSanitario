import React from 'react';
import styles from './ui.module.css';

const ProgressBar = ({ progress = 0, label }) => {
  return (
    <div className={styles.progressBarContainer}>
      {label && <div className={styles.progressLabel}>{label}</div>}
      <div className={styles.progressBar}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

