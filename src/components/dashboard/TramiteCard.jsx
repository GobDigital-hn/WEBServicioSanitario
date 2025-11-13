import React from 'react';
import styles from './dashboard.module.css';

const TramiteCard = ({ tramite, tipo, onIniciar }) => {
  const getEstadoBadge = () => {
    if (tipo === 'vigente') {
      return <span className={styles.badgeVigente}>En Proceso</span>;
    }
    if (tipo === 'archivado') {
      return <span className={styles.badgeArchivado}>Completado</span>;
    }
    return null;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{tramite.nombre}</h3>
        {getEstadoBadge()}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardInfo}>
          <span className={styles.cardLabel}>Código:</span>
          <span className={styles.cardValue}>{tramite.codigo}</span>
        </div>

        {tramite.descripcion && (
          <p className={styles.cardDescription}>{tramite.descripcion}</p>
        )}

        {tramite.fechaInicio && (
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Fecha de inicio:</span>
            <span className={styles.cardValue}>{formatearFecha(tramite.fechaInicio)}</span>
          </div>
        )}

        {tramite.fechaFin && (
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Fecha de finalización:</span>
            <span className={styles.cardValue}>{formatearFecha(tramite.fechaFin)}</span>
          </div>
        )}

        {tramite.faseActual && (
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Fase actual:</span>
            <span className={styles.cardValue}>{tramite.faseActual}</span>
          </div>
        )}

        {tramite.tiempoEstimado && (
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Tiempo estimado:</span>
            <span className={styles.cardValue}>{tramite.tiempoEstimado}</span>
          </div>
        )}

        {tramite.costo && (
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Costo:</span>
            <span className={styles.cardValue}>{tramite.costo}</span>
          </div>
        )}
      </div>

      {tipo === 'disponible' && (
        <div className={styles.cardFooter}>
          <button onClick={onIniciar} className={styles.btnIniciar}>
            Iniciar Trámite
          </button>
        </div>
      )}
    </div>
  );
};

export default TramiteCard;

