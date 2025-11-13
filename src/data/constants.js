// Constantes del sistema

export const RUTAS = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TRAMITE: '/tramite/:id',
  SIMULACION: '/simulacion',
};

export const ESTADOS_TRAMITE = {
  EN_PROCESO: 'en_proceso',
  COMPLETADO: 'completado',
  PENDIENTE: 'pendiente',
};

export const FASES_SIMULACION = {
  SAC: 'sac',
  TECNICO: 'tecnico',
  LEGAL: 'legal',
  EMISION: 'emision',
};

export const DURACION_FASES = {
  SAC: 2000, // 2 segundos
  TECNICO: 3000, // 3 segundos
  LEGAL: 2500, // 2.5 segundos
  EMISION: 1500, // 1.5 segundos
};

export const EMAIL_CONFIG = {
  FROM: 'noreply@arsa.hn',
  SUBJECT: 'Certificado de Registro Sanitario - ARSA',
};

