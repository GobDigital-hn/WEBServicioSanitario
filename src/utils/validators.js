/**
 * Funciones de validación para formularios
 */

import { VALIDACIONES } from '../data/formData';

/**
 * Valida un email
 */
export const validarEmail = (email) => {
  if (!email) return 'El email es requerido';
  if (!VALIDACIONES.email.pattern.test(email)) {
    return VALIDACIONES.email.message;
  }
  return null;
};

/**
 * Valida un teléfono
 */
export const validarTelefono = (telefono) => {
  if (!telefono) return 'El teléfono es requerido';
  if (!VALIDACIONES.telefono.pattern.test(telefono)) {
    return VALIDACIONES.telefono.message;
  }
  return null;
};

/**
 * Valida un RTN
 */
export const validarRTN = (rtn) => {
  if (!rtn) return 'El RTN es requerido';
  if (!VALIDACIONES.rtn.pattern.test(rtn)) {
    return VALIDACIONES.rtn.message;
  }
  return null;
};

/**
 * Valida que un campo no esté vacío
 */
export const validarRequerido = (valor, nombreCampo) => {
  if (!valor || valor.trim() === '') {
    return `${nombreCampo} es requerido`;
  }
  return null;
};

/**
 * Valida múltiples campos de un formulario
 */
export const validarFormulario = (campos, valores) => {
  const errores = {};
  
  campos.forEach((campo) => {
    const { name, validators } = campo;
    const valor = valores[name];
    
    validators.forEach((validator) => {
      const error = validator(valor, name);
      if (error && !errores[name]) {
        errores[name] = error;
      }
    });
  });
  
  return errores;
};

