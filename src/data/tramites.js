// Lista de trámites disponibles

export const TRAMITES_DISPONIBLES = [
  {
    id: 'PF010',
    codigo: 'PF010',
    nombre: 'Nuevo Certificado Registro Sanitario de Productos Cosméticos',
    descripcion: 'Solicitud para obtener un nuevo certificado de registro sanitario para productos cosméticos en Honduras.',
    categoria: 'Productos Farmacéuticos',
    requisitos: [
      'Formulario de solicitud completo',
      'Documento de identidad del titular',
      'Registro de empresa',
      'Especificaciones técnicas del producto',
      'Certificado de fabricante',
      'Etiqueta del producto',
    ],
    tiempoEstimado: '15-20 días hábiles',
    costo: 'L. 500.00',
    activo: true,
  },
];

export const TRAMITES_VIGENTES = [
  {
    id: 'PF010-001',
    codigo: 'PF010',
    nombre: 'Nuevo Certificado Registro Sanitario de Productos Cosméticos',
    fechaInicio: '2025-01-15',
    estado: 'en_revision',
    faseActual: 'Revisión Técnica',
  },
];

export const TRAMITES_ARCHIVADOS = [
  {
    id: 'PF010-002',
    codigo: 'PF010',
    nombre: 'Nuevo Certificado Registro Sanitario de Productos Cosméticos',
    fechaInicio: '2024-12-10',
    fechaFin: '2024-12-28',
    estado: 'completado',
  },
];

