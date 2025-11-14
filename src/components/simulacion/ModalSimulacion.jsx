import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import ModalConfirmacionEnvio from './ModalConfirmacionEnvio';
import Modal from '../ui/Modal';
import ProgressBar from '../ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './simulacion.module.css';

const ModalSimulacion = ({ isOpen, onClose, tramiteId }) => {
  const { usuario, completarTramite } = useAppContext();
  
  // Estados del componente
  const [itemsCompletados, setItemsCompletados] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [verificacionesVisibles, setVerificacionesVisibles] = useState([]);
  const [faseActiva, setFaseActiva] = useState(null);
  
  // Referencias para control de ejecución
  const timeoutsRef = useRef([]);
  const isRunningRef = useRef(false);

  // Configuración de las fases de procesamiento según el flujo real
  const FASES = [
    {
      id: 1,
      nombre: 'SAC',
      texto: 'Revisión SAC - Verificación de documentación',
      verificaciones: [
        'Verificando que toda la información esté completa',
        'Validando documentos solicitados cargados',
        'Admitiendo solicitud para revisión técnica',
      ],
    },
    {
      id: 2,
      nombre: 'Verificación Técnica',
      texto: 'Revisión Técnica - Productos Farmacéuticos',
      verificaciones: [
        'Asignando a técnico de productos farmacéuticos',
        'Revisando minuciosamente la documentación',
        'Emitiendo informe técnico conforme',
      ],
    },
    {
      id: 3,
      nombre: 'Fase Legal',
      texto: 'Revisión Legal',
      verificaciones: [
        'Revisando cumplimiento normativo',
        'Evaluando aspectos legales del trámite',
        'Emitiendo informe legal conforme',
      ],
    },
    {
      id: 4,
      nombre: 'Emisión',
      texto: 'Emisión del Certificado',
      verificaciones: [
        'Generando certificado de registro sanitario',
        'Finalizando trámite',
        'Preparando envío por correo electrónico',
      ],
    },
  ];

  const DURACION_FASE = 3000; // 3 segundos por fase
  const DURACION_VERIFICACION = 600; // 600ms entre cada verificación
  const DELAY_CONFIRMACION = 1000; // 1 segundo antes de mostrar confirmación

  /**
   * Limpia todos los timeouts activos
   */
  const limpiarTimeouts = () => {
    timeoutsRef.current.forEach((timeout) => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
    timeoutsRef.current = [];
  };

  /**
   * Resetea todos los estados del componente
   */
  const resetearEstado = () => {
    setItemsCompletados([]);
    setProgreso(0);
    setMostrarConfirmacion(false);
    setCompletado(false);
    setVerificacionesVisibles([]);
    setFaseActiva(null);
    isRunningRef.current = false;
  };

  /**
   * Muestra las verificaciones de una fase de forma secuencial
   */
  const mostrarVerificaciones = (faseId) => {
    const fase = FASES.find((f) => f.id === faseId);
    if (!fase || !fase.verificaciones) return;

    fase.verificaciones.forEach((verificacion, index) => {
      const timeout = setTimeout(() => {
        setVerificacionesVisibles((prev) => {
          const key = `${faseId}-${index}`;
          if (!prev.find((v) => v.key === key)) {
            return [...prev, { key, texto: verificacion, faseId }];
          }
          return prev;
        });
      }, index * DURACION_VERIFICACION);
      timeoutsRef.current.push(timeout);
    });
  };

  /**
   * Limpia las verificaciones de una fase específica
   */
  const limpiarVerificaciones = (faseId) => {
    setVerificacionesVisibles((prev) =>
      prev.filter((v) => v.faseId !== faseId)
    );
  };

  /**
   * Inicia la simulación de las fases
   */
  const iniciarSimulacion = () => {
    if (isRunningRef.current) {
      return;
    }

    isRunningRef.current = true;
    resetearEstado();

    // Fase 1: SAC - Iniciar inmediatamente
    setFaseActiva(1);
    limpiarVerificaciones(1);
    mostrarVerificaciones(1);

    // Completar Fase 1 (SAC) y pasar a Fase 2 después de 3 segundos
    const timeout1 = setTimeout(() => {
      setItemsCompletados((prev) => {
        const nuevos = [...prev];
        if (!nuevos.includes(1)) {
          nuevos.push(1);
        }
        return nuevos;
      });
      setProgreso(25);
      
      // Iniciar Fase 2 inmediatamente después de completar Fase 1
      setFaseActiva(2);
      limpiarVerificaciones(1);
      limpiarVerificaciones(2);
      mostrarVerificaciones(2);
    }, DURACION_FASE);
    timeoutsRef.current.push(timeout1);

    // Completar Fase 2 y pasar a Fase 3 después de 6 segundos totales
    const timeout2 = setTimeout(() => {
      setItemsCompletados((prev) => {
        const nuevos = [...prev];
        if (!nuevos.includes(2)) {
          nuevos.push(2);
        }
        return nuevos;
      });
      setProgreso(50);
      
      // Iniciar Fase 3 inmediatamente después de completar Fase 2
      setFaseActiva(3);
      limpiarVerificaciones(2);
      limpiarVerificaciones(3);
      mostrarVerificaciones(3);
    }, DURACION_FASE * 2);
    timeoutsRef.current.push(timeout2);

    // Completar Fase 3 y pasar a Fase 4 después de 9 segundos totales
    const timeout3 = setTimeout(() => {
      setItemsCompletados((prev) => {
        const nuevos = [...prev];
        if (!nuevos.includes(3)) {
          nuevos.push(3);
        }
        return nuevos;
      });
      setProgreso(75);
      
      // Iniciar Fase 4 inmediatamente después de completar Fase 3
      setFaseActiva(4);
      limpiarVerificaciones(3);
      limpiarVerificaciones(4);
      mostrarVerificaciones(4);
    }, DURACION_FASE * 3);
    timeoutsRef.current.push(timeout3);

    // Completar Fase 4 después de 12 segundos totales
    const timeout4 = setTimeout(() => {
      setItemsCompletados((prev) => {
        const nuevos = [...prev];
        if (!nuevos.includes(4)) {
          nuevos.push(4);
        }
        return nuevos;
      });
      setProgreso(100);
    }, DURACION_FASE * 4);
    timeoutsRef.current.push(timeout4);

    // Después de completar la cuarta fase, mostrar mensaje de completado
    const timeout5 = setTimeout(() => {
      setFaseActiva(null);
      limpiarVerificaciones(4);
      setCompletado(true);
      completarTramite();

      // Finalmente, mostrar el modal de confirmación
      const timeout6 = setTimeout(() => {
        setMostrarConfirmacion(true);
      }, DELAY_CONFIRMACION);
      timeoutsRef.current.push(timeout6);
    }, DURACION_FASE * 4 + 500); // Pequeño delay para mostrar el check final
    timeoutsRef.current.push(timeout5);
  };

  /**
   * Efecto principal: Controla el ciclo de vida de la simulación
   */
  useEffect(() => {
    if (!isOpen) {
      limpiarTimeouts();
      resetearEstado();
      return;
    }

    iniciarSimulacion();

    return () => {
      limpiarTimeouts();
    };
  }, [isOpen]);

  /**
   * Maneja el cierre del modal de confirmación
   */
  const handleCerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
    isRunningRef.current = false;
    onClose();
  };

  /**
   * Obtiene las verificaciones visibles para una fase específica
   */
  const getVerificacionesFase = (faseId) => {
    return verificacionesVisibles.filter((v) => v.faseId === faseId);
  };

  /**
   * Renderiza un item de fase con sus verificaciones
   */
  const renderItem = (fase) => {
    const estaCompletado = itemsCompletados.includes(fase.id);
    const verificacionesFase = getVerificacionesFase(fase.id);
    const faseActiva = verificacionesFase.length > 0;

    return (
      <motion.div
        key={fase.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`${styles.itemSimulacion} ${estaCompletado ? styles.itemCompletado : ''} ${faseActiva ? styles.itemActivo : ''}`}
      >
        <div className={styles.itemContent}>
          {estaCompletado ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={styles.checkIcon}
            >
              ✓
            </motion.span>
          ) : (
            <span className={styles.checkIconPending}>○</span>
          )}
          <span className={styles.itemTexto}>{fase.texto}</span>
        </div>

        {faseActiva && (
          <div className={styles.verificacionesContainer}>
            <AnimatePresence>
              {verificacionesFase.map((verificacion) => (
                <motion.div
                  key={verificacion.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.verificacionItem}
                >
                  <span className={styles.verificacionCheck}>✓</span>
                  <span className={styles.verificacionTexto}>
                    {verificacion.texto}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !mostrarConfirmacion}
        onClose={onClose}
        size="large"
        title="Simulando las fases"
      >
        <div className={styles.simulacionContainer}>
          <ProgressBar
            progress={progreso}
            label={`Progreso: ${Math.round(progreso)}%`}
          />

          <div className={styles.faseContainer}>
            <h3 className={styles.faseTitulo}>
              {faseActiva
                ? `${FASES.find((f) => f.id === faseActiva)?.nombre || `Fase ${faseActiva}`}: ${FASES.find((f) => f.id === faseActiva)?.texto}`
                : completado
                ? 'Proceso completado'
                : 'Procesando solicitud...'}
            </h3>

            <div className={styles.itemsList}>
              {FASES.map((fase) => renderItem(fase))}
            </div>

            {completado && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.completadoMensaje}
              >
                <span className={styles.completadoIcon}>✓</span>
                <p>
                  Proceso completado exitosamente. Listo para generar y enviar
                  el certificado.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </Modal>

      {mostrarConfirmacion && (
        <ModalConfirmacionEnvio
          isOpen={mostrarConfirmacion}
          onClose={handleCerrarConfirmacion}
          emailInicial=""
        />
      )}
    </>
  );
};

export default ModalSimulacion;
