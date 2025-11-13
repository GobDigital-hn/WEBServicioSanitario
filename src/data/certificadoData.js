// Datos estáticos para la generación del certificado PDF
// Nota: Los datos del certificado se generan con valores predefinidos

// Función para calcular fecha de vencimiento (+2 años)
function calcularFechaVencimiento() {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() + 2);
  return fecha.toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Función para generar código de registro
function generarCodigoRegistro() {
  const año = new Date().getFullYear();
  const numero = Math.floor(Math.random() * 9999).toString().padStart(6, '0');
  return `PF010-${año}-${numero}`;
}

// Función para formatear fecha en español
function formatearFecha(fecha) {
  return fecha.toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const DATOS_CERTIFICADO = {
  // Fechas (generadas dinámicamente)
  fecha_resolucion_legal: formatearFecha(new Date()),
  FECHA_INICIO_C: formatearFecha(new Date()),
  fecha_fin_legal: calcularFechaVencimiento(),
  
  // Código de registro (generado)
  CODIGO: generarCodigoRegistro(),
  
  // Datos del producto
  nombre_producto: 'CREMA HIDRATANTE FACIAL',
  forma_cosmetica_producto: 'Crema',
  presentacion_comercial: 'Frasco de 50ml',
  
  // Datos del titular y empresa
  nombre_titular: 'COSMÉTICOS HONDURAS S.A. DE C.V.',
  nombre_fabricante_producto: 'LABORATORIOS INTERNACIONALES LTDA.',
  nombre_distribuidor: 'DISTRIBUIDORA CENTROAMERICANA S.A.',
  nombre_profesional: 'Dr. Juan Carlos Pérez Martínez',
  
  // Textos legales
  observaciones: `La emisión del presente certificado y la impresión en soporte físico es una reproducción del documento original que se encuentra en formato electrónico, cuya representación digital goza de plena autenticidad, integridad y no repudio; lo anterior con fundamento en el Decreto Ejecutivo PCM-016-2020 Articulo 02, Articulo 7 de la Ley sobre Firmas Electrónicas reformado mediante Decreto Legislativo 33-2020 Artículo 38 inciso "A".`,
  
  clausula_cancelacion: `El (La) NUEVO REGISTRO SANITARIO aquí autorizado podrá en cualquier momento ser cancelado cuando por información actualizada el uso del producto resulte no seguro; por falsificación o alteración de los documentos utilizados en el registro o inscripción sanitaria; cuando no cumpla con las especificaciones del fabricante consignados en la hoja de seguridad; cuando el producto se comercialice en condiciones diferentes con las cuales fue aprobado.`,
};

