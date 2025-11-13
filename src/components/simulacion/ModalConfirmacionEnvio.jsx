import React, { useState, useEffect } from 'react';
import { generarPDFBlob, generarCertificadoPDF } from '../../utils/pdfGenerator';
import { DATOS_CERTIFICADO } from '../../data/certificadoData';
import { useAppContext } from '../../context/AppContext';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import styles from './simulacion.module.css';
import axios from 'axios';

const ModalConfirmacionEnvio = ({ isOpen, onClose, emailInicial }) => {
  const { usuario } = useAppContext();
  const [email, setEmail] = useState(emailInicial || '');
  const [pdfPreview, setPdfPreview] = useState(null);
  const [generando, setGenerando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail(emailInicial || '');
      generarPreview();
    }
  }, [isOpen, emailInicial]);

  const generarPreview = async () => {
    setGenerando(true);
    try {
      const pdfBlob = await generarPDFBlob();
      const previewUrl = URL.createObjectURL(pdfBlob);
      setPdfPreview(previewUrl);
    } catch (err) {
      console.error('Error al generar preview:', err);
      setError('Error al generar el preview del certificado');
    } finally {
      setGenerando(false);
    }
  };

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEnviarCorreo = async () => {
    setError('');

    if (!email || email.trim() === '') {
      setError('Por favor ingrese un correo electrónico');
      return;
    }

    if (!validarEmail(email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }

    setEnviando(true);

    try {
      console.log('[ModalConfirmacionEnvio] Iniciando generación de PDF');
      const pdfDoc = await generarCertificadoPDF();
      console.log('[ModalConfirmacionEnvio] PDF generado exitosamente');
      
      const pdfBase64 = pdfDoc.output('datauristring');
      console.log('[ModalConfirmacionEnvio] PDF convertido a base64');

      console.log('[ModalConfirmacionEnvio] Enviando solicitud a API Resend');
      const response = await axios.post('/api/send-certificate', {
        email: email.trim(),
        pdfData: pdfBase64,
        certificateNumber: DATOS_CERTIFICADO.CODIGO,
      });

      console.log('[ModalConfirmacionEnvio] Respuesta recibida:', response.status);

      if (response.data.success) {
        console.log('[ModalConfirmacionEnvio] Email enviado exitosamente');
        setEnviado(true);
      } else {
        const errorMsg = response.data.error || response.data.details || 'Error al enviar el correo';
        console.error('[ModalConfirmacionEnvio] Error en respuesta:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('[ModalConfirmacionEnvio] Error al enviar correo:', err.message);
      console.error('[ModalConfirmacionEnvio] Detalles:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      
      let errorMessage = 'Error al enviar el correo. Por favor, intente descargar el PDF manualmente.';
      
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        errorMessage = 'No se pudo conectar con el servidor. Asegúrate de que el servidor de desarrollo esté ejecutándose (npm run dev:server o npm run dev:all).';
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint no encontrado. Verifica que el servidor de desarrollo esté corriendo en el puerto 3001.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
        if (err.response.data.details) {
          errorMessage += ': ' + err.response.data.details;
        }
      } else if (err.response?.data?.details) {
        errorMessage = err.response.data.details;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setEnviando(false);
    }
  };

  const handleDescargar = async () => {
    try {
      const pdfDoc = await generarCertificadoPDF();
      pdfDoc.save('certificado-registro-sanitario.pdf');
    } catch (err) {
      console.error('Error al descargar:', err);
      setError('Error al descargar el PDF');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      title="✓ Certificado Generado Exitosamente"
    >
      <div className={styles.confirmacionContainer}>
        {enviado ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h3>Certificado Enviado</h3>
            <p>El certificado ha sido enviado exitosamente a:</p>
            <p className={styles.emailDestino}>{email}</p>
            <Button onClick={onClose} variant="primary">
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <p className={styles.confirmacionTexto}>
              Su certificado de registro sanitario ha sido generado y está listo para enviarse.
            </p>

            {generando ? (
              <div className={styles.loadingContainer}>
                <LoadingSpinner size="large" />
                <p>Generando preview del certificado...</p>
              </div>
            ) : (
              <div className={styles.previewContainer}>
                <iframe
                  src={pdfPreview}
                  className={styles.previewFrame}
                  title="Preview del certificado"
                />
              </div>
            )}

            <div className={styles.emailInputContainer}>
              <label className={styles.emailLabel}>
                <span className={styles.emailIcon}>✉</span>
                Correo electrónico para envío:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`${styles.emailInput} ${error && !email ? styles.emailInputError : ''}`}
                placeholder="ejemplo@correo.com"
                disabled={generando || enviando}
              />
              {error && <div className={styles.errorMessage}>{error}</div>}
            </div>

            <div className={styles.actions}>
              <Button
                onClick={handleEnviarCorreo}
                variant="primary"
                disabled={generando || enviando || !email}
                fullWidth
              >
                {enviando ? 'Enviando...' : 'Enviar por Correo'}
              </Button>
              <Button
                onClick={handleDescargar}
                variant="secondary"
                disabled={generando}
                fullWidth
              >
                Descargar PDF
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalConfirmacionEnvio;
