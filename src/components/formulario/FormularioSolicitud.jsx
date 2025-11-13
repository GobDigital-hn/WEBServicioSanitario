import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { TRAMITES_DISPONIBLES } from '../../data/tramites';
import { OPCIONES_PAIS, OPCIONES_DEPARTAMENTO, OPCIONES_FORMA_COSMETICA, VALIDACIONES } from '../../data/formData';
import ModalSimulacion from '../simulacion/ModalSimulacion';
import styles from './formulario.module.css';
const logoArsa = '/LogoArsa.png';

const FormularioSolicitud = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, iniciarTramite } = useAppContext();
  const tramite = TRAMITES_DISPONIBLES.find((t) => t.id === id);

  const [seccionesAbiertas, setSeccionesAbiertas] = useState({
    informacion: true,
    empresa: false,
    producto: false,
    documentos: false,
  });

  const [formData, setFormData] = useState({
    // Información General
    nombre_solicitante: usuario?.nombre || '',
    email: usuario?.email || '',
    telefono: '',
    tipo_documento: 'rtn',
    numero_documento: '',
    
    // Datos de la Empresa
    nombre_empresa: '',
    rtn_empresa: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: 'HN',
    telefono_empresa: '',
    email_empresa: '',
    
    // Datos del Producto
    nombre_producto: '',
    forma_cosmetica: '',
    otra_forma_cosmetica: '',
    presentacion_comercial: '',
    nombre_fabricante: '',
    nombre_distribuidor: '',
    nombre_profesional: '',
    
    // Documentos
    documentos: [],
  });

  const [errores, setErrores] = useState({});
  const [mostrarSimulacion, setMostrarSimulacion] = useState(false);

  const toggleSeccion = (seccion) => {
    setSeccionesAbiertas((prev) => ({
      ...prev,
      [seccion]: !prev[seccion],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos[name];
        return nuevos;
      });
    }
  };

  const validarCampo = (name, value) => {
    const erroresCampo = {};
    const camposRequeridos = ['nombre_solicitante', 'email'];
    
    // Solo validar si está vacío si es un campo requerido
    if (camposRequeridos.includes(name)) {
      if (!value || value.trim() === '') {
        erroresCampo[name] = 'Este campo es requerido';
        return erroresCampo;
      }
    }

    // Validar formato solo si el campo tiene valor (aunque no sea requerido)
    if (value && value.trim() !== '') {
      if (name === 'email' || name === 'email_empresa') {
        if (!VALIDACIONES.email.pattern.test(value)) {
          erroresCampo[name] = VALIDACIONES.email.message;
          return erroresCampo;
        }
      }

      if (name === 'telefono' || name === 'telefono_empresa') {
        if (!VALIDACIONES.telefono.pattern.test(value)) {
          erroresCampo[name] = VALIDACIONES.telefono.message;
          return erroresCampo;
        }
      }

      if (name === 'rtn_empresa') {
        if (!VALIDACIONES.rtn.pattern.test(value)) {
          erroresCampo[name] = VALIDACIONES.rtn.message;
          return erroresCampo;
        }
      }
    }

    return erroresCampo;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const erroresCampo = validarCampo(name, value);
    setErrores((prev) => ({ ...prev, ...erroresCampo }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      documentos: [...prev.documentos, ...files],
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    // Campos requeridos del formulario
    const camposRequeridos = [
      'nombre_solicitante',
      'email',
    ];

    camposRequeridos.forEach((campo) => {
      const error = validarCampo(campo, formData[campo]);
      if (error[campo]) {
        nuevosErrores[campo] = error[campo];
      }
    });

    // Validar formato de email si está lleno (pero no requerir otros campos)
    if (formData.email && !VALIDACIONES.email.pattern.test(formData.email)) {
      nuevosErrores.email = VALIDACIONES.email.message;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      alert('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    iniciarTramite(id, formData);
    setMostrarSimulacion(true);
  };

  const handleCerrarSimulacion = () => {
    setMostrarSimulacion(false);
    navigate('/dashboard');
  };

  if (!tramite) {
    return (
      <div className={styles.container}>
        <p>Trámite no encontrado</p>
        <button onClick={() => navigate('/dashboard')}>Volver al menú</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <img src={logoArsa} alt="Logo ARSA" className={styles.logo} />
          <div>
            <h1 className={styles.title}>{tramite.nombre}</h1>
            <p className={styles.subtitle}>Código: {tramite.codigo}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Sección 1: Información General */}
        <div className={styles.seccion}>
          <div
            className={styles.seccionHeader}
            onClick={() => toggleSeccion('informacion')}
          >
            <h2 className={styles.seccionTitulo}>
              1. Información General del Solicitante
            </h2>
            <span className={styles.toggleIcon}>
              {seccionesAbiertas.informacion ? '−' : '+'}
            </span>
          </div>
          {seccionesAbiertas.informacion && (
            <div className={styles.seccionBody}>
              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Nombre Completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre_solicitante"
                    value={formData.nombre_solicitante}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.nombre_solicitante ? styles.inputError : ''}`}
                  />
                  {errores.nombre_solicitante && (
                    <span className={styles.error}>{errores.nombre_solicitante}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.email ? styles.inputError : ''}`}
                  />
                  {errores.email && (
                    <span className={styles.error}>{errores.email}</span>
                  )}
                </div>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.telefono ? styles.inputError : ''}`}
                  />
                  {errores.telefono && (
                    <span className={styles.error}>{errores.telefono}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Tipo de Documento
                  </label>
                  <select
                    name="tipo_documento"
                    value={formData.tipo_documento}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="rtn">RTN</option>
                    <option value="pasaporte">Pasaporte</option>
                    <option value="cedula">Cédula de Identidad</option>
                  </select>
                </div>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    name="numero_documento"
                    value={formData.numero_documento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.numero_documento ? styles.inputError : ''}`}
                  />
                  {errores.numero_documento && (
                    <span className={styles.error}>{errores.numero_documento}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección 2: Datos de la Empresa */}
        <div className={styles.seccion}>
          <div
            className={styles.seccionHeader}
            onClick={() => toggleSeccion('empresa')}
          >
            <h2 className={styles.seccionTitulo}>
              2. Datos de la Empresa / Titular
            </h2>
            <span className={styles.toggleIcon}>
              {seccionesAbiertas.empresa ? '−' : '+'}
            </span>
          </div>
          {seccionesAbiertas.empresa && (
            <div className={styles.seccionBody}>
              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    name="nombre_empresa"
                    value={formData.nombre_empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.nombre_empresa ? styles.inputError : ''}`}
                  />
                  {errores.nombre_empresa && (
                    <span className={styles.error}>{errores.nombre_empresa}</span>
                  )}
                </div>
                <div className={styles.col}>
                  <label className={styles.label}>
                    RTN
                  </label>
                  <input
                    type="text"
                    name="rtn_empresa"
                    value={formData.rtn_empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.rtn_empresa ? styles.inputError : ''}`}
                  />
                  {errores.rtn_empresa && (
                    <span className={styles.error}>{errores.rtn_empresa}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.direccion ? styles.inputError : ''}`}
                  />
                  {errores.direccion && (
                    <span className={styles.error}>{errores.direccion}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.ciudad ? styles.inputError : ''}`}
                  />
                  {errores.ciudad && (
                    <span className={styles.error}>{errores.ciudad}</span>
                  )}
                </div>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Departamento
                  </label>
                  <select
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleChange}
                    className={`${styles.select} ${errores.departamento ? styles.inputError : ''}`}
                  >
                    <option value="">Seleccione...</option>
                    {OPCIONES_DEPARTAMENTO.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
                  {errores.departamento && (
                    <span className={styles.error}>{errores.departamento}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>País</label>
                  <select
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    {OPCIONES_PAIS.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.col}>
                  <label className={styles.label}>Teléfono de la Empresa</label>
                  <input
                    type="tel"
                    name="telefono_empresa"
                    value={formData.telefono_empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.telefono_empresa ? styles.inputError : ''}`}
                  />
                  {errores.telefono_empresa && (
                    <span className={styles.error}>{errores.telefono_empresa}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>Email de la Empresa</label>
                  <input
                    type="email"
                    name="email_empresa"
                    value={formData.email_empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.email_empresa ? styles.inputError : ''}`}
                  />
                  {errores.email_empresa && (
                    <span className={styles.error}>{errores.email_empresa}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección 3: Datos del Producto */}
        <div className={styles.seccion}>
          <div
            className={styles.seccionHeader}
            onClick={() => toggleSeccion('producto')}
          >
            <h2 className={styles.seccionTitulo}>
              3. Datos del Producto
            </h2>
            <span className={styles.toggleIcon}>
              {seccionesAbiertas.producto ? '−' : '+'}
            </span>
          </div>
          {seccionesAbiertas.producto && (
            <div className={styles.seccionBody}>
              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Nombre Comercial del Producto
                  </label>
                  <input
                    type="text"
                    name="nombre_producto"
                    value={formData.nombre_producto}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.nombre_producto ? styles.inputError : ''}`}
                  />
                  {errores.nombre_producto && (
                    <span className={styles.error}>{errores.nombre_producto}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Forma Cosmética
                  </label>
                  <select
                    name="forma_cosmetica"
                    value={formData.forma_cosmetica}
                    onChange={handleChange}
                    className={`${styles.select} ${errores.forma_cosmetica ? styles.inputError : ''}`}
                  >
                    <option value="">Seleccione...</option>
                    {OPCIONES_FORMA_COSMETICA.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
                  {errores.forma_cosmetica && (
                    <span className={styles.error}>{errores.forma_cosmetica}</span>
                  )}
                </div>
                {formData.forma_cosmetica === 'otro' && (
                  <div className={styles.col}>
                    <label className={styles.label}>Otra Forma Cosmética</label>
                    <input
                      type="text"
                      name="otra_forma_cosmetica"
                      value={formData.otra_forma_cosmetica}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>
                    Presentación Comercial
                  </label>
                  <input
                    type="text"
                    name="presentacion_comercial"
                    value={formData.presentacion_comercial}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errores.presentacion_comercial ? styles.inputError : ''}`}
                    placeholder="Ej: Frasco de 50ml"
                  />
                  {errores.presentacion_comercial && (
                    <span className={styles.error}>{errores.presentacion_comercial}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>Nombre del Fabricante</label>
                  <input
                    type="text"
                    name="nombre_fabricante"
                    value={formData.nombre_fabricante}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.col}>
                  <label className={styles.label}>Nombre del Distribuidor</label>
                  <input
                    type="text"
                    name="nombre_distribuidor"
                    value={formData.nombre_distribuidor}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>Profesional Responsable</label>
                  <input
                    type="text"
                    name="nombre_profesional"
                    value={formData.nombre_profesional}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección 4: Documentos */}
        <div className={styles.seccion}>
          <div
            className={styles.seccionHeader}
            onClick={() => toggleSeccion('documentos')}
          >
            <h2 className={styles.seccionTitulo}>
              4. Documentos Adjuntos
            </h2>
            <span className={styles.toggleIcon}>
              {seccionesAbiertas.documentos ? '−' : '+'}
            </span>
          </div>
          {seccionesAbiertas.documentos && (
            <div className={styles.seccionBody}>
              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.label}>Subir Documentos</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <small className={styles.hint}>
                    Formatos aceptados: PDF, DOC, DOCX, JPG, PNG (máx. 10MB por archivo)
                  </small>
                  {formData.documentos.length > 0 && (
                    <div className={styles.documentosList}>
                      <p>Documentos seleccionados: {formData.documentos.length}</p>
                      <ul>
                        {formData.documentos.map((doc, index) => (
                          <li key={index}>{doc.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className={styles.btnSecondary}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.btnPrimary}>
            Continuar
          </button>
        </div>
      </form>

      {mostrarSimulacion && (
        <ModalSimulacion
          isOpen={mostrarSimulacion}
          onClose={handleCerrarSimulacion}
          tramiteId={id}
        />
      )}
    </div>
  );
};

export default FormularioSolicitud;

