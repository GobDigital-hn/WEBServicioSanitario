import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { TRAMITES_DISPONIBLES, TRAMITES_VIGENTES, TRAMITES_ARCHIVADOS } from '../../data/tramites';
import TramiteCard from './TramiteCard';
import styles from './dashboard.module.css';
const logoArsa = '/LogoArsa.png';

const MenuPrincipal = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAppContext();
  const [tabActivo, setTabActivo] = useState('disponibles');
  const [busqueda, setBusqueda] = useState('');

  const handleIniciarTramite = (tramiteId) => {
    navigate(`/tramite/${tramiteId}`);
  };

  const filtrarTramites = (tramites) => {
    if (!busqueda) return tramites;
    const busquedaLower = busqueda.toLowerCase();
    return tramites.filter(
      (tramite) =>
        tramite.nombre.toLowerCase().includes(busquedaLower) ||
        tramite.codigo.toLowerCase().includes(busquedaLower)
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <img src={logoArsa} alt="Logo ARSA" className={styles.logo} />
            <h1 className={styles.title}>Portal Ciudadano ARSA</h1>
          </div>
          <div className={styles.userSection}>
            <span className={styles.userName}>Bienvenido, {usuario?.nombre}</span>
            <button onClick={logout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tabActivo === 'vigentes' ? styles.tabActive : ''}`}
              onClick={() => setTabActivo('vigentes')}
            >
              Trámites Vigentes
            </button>
            <button
              className={`${styles.tab} ${tabActivo === 'archivados' ? styles.tabActive : ''}`}
              onClick={() => setTabActivo('archivados')}
            >
              Trámites Archivados
            </button>
            <button
              className={`${styles.tab} ${tabActivo === 'disponibles' ? styles.tabActive : ''}`}
              onClick={() => setTabActivo('disponibles')}
            >
              Trámites Disponibles
            </button>
          </div>

          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Buscar trámites..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.tramitesGrid}>
            {tabActivo === 'disponibles' &&
              filtrarTramites(TRAMITES_DISPONIBLES).map((tramite) => (
                <TramiteCard
                  key={tramite.id}
                  tramite={tramite}
                  tipo="disponible"
                  onIniciar={() => handleIniciarTramite(tramite.id)}
                />
              ))}

            {tabActivo === 'vigentes' &&
              filtrarTramites(TRAMITES_VIGENTES).map((tramite) => (
                <TramiteCard
                  key={tramite.id}
                  tramite={tramite}
                  tipo="vigente"
                />
              ))}

            {tabActivo === 'archivados' &&
              filtrarTramites(TRAMITES_ARCHIVADOS).map((tramite) => (
                <TramiteCard
                  key={tramite.id}
                  tramite={tramite}
                  tipo="archivado"
                />
              ))}

            {tabActivo === 'disponibles' && filtrarTramites(TRAMITES_DISPONIBLES).length === 0 && (
              <div className={styles.emptyState}>
                <p>No se encontraron trámites disponibles</p>
              </div>
            )}

            {tabActivo === 'vigentes' && filtrarTramites(TRAMITES_VIGENTES).length === 0 && (
              <div className={styles.emptyState}>
                <p>No tiene trámites vigentes</p>
              </div>
            )}

            {tabActivo === 'archivados' && filtrarTramites(TRAMITES_ARCHIVADOS).length === 0 && (
              <div className={styles.emptyState}>
                <p>No tiene trámites archivados</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuPrincipal;

