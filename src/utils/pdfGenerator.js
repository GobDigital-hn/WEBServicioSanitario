import jsPDF from 'jspdf';
import { DATOS_CERTIFICADO } from '../data/certificadoData';

/**
 * Convierte una imagen a base64 optimizada y obtiene sus dimensiones
 * Comprime la imagen para reducir el tamaño del PDF
 * @param {string} url - URL de la imagen
 * @param {number} maxWidth - Ancho máximo en píxeles (default: 300)
 * @param {number} quality - Calidad JPEG (0-1, default: 0.8)
 * @returns {Promise<{base64: string, width: number, height: number}>} Base64 y dimensiones de la imagen
 */
const imageToBase64WithDimensions = (url, maxWidth = 200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Calcular dimensiones manteniendo proporción
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Crear canvas con dimensiones optimizadas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Dibujar fondo blanco primero (para PNGs con transparencia)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      // Dibujar imagen redimensionada sobre el fondo blanco
      ctx.drawImage(img, 0, 0, width, height);
      
      try {
        // Usar JPEG con calidad reducida para comprimir
        const base64 = canvas.toDataURL('image/jpeg', quality);
        console.log('[pdfGenerator] Imagen optimizada:', {
          original: `${img.width}x${img.height}`,
          optimized: `${width}x${height}`,
          size: Math.round(base64.length / 1024) + 'KB'
        });
        resolve({
          base64,
          width: width,
          height: height,
        });
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      // Fallback: intentar con fetch
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const img2 = new Image();
            img2.onload = () => {
              // Aplicar misma optimización
              let width = img2.width;
              let height = img2.height;
              
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
              
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              
              // Dibujar fondo blanco primero (para PNGs con transparencia)
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              
              // Dibujar imagen redimensionada sobre el fondo blanco
              ctx.drawImage(img2, 0, 0, width, height);
              
              const base64 = canvas.toDataURL('image/jpeg', quality);
              resolve({
                base64,
                width: width,
                height: height,
              });
            };
            img2.onerror = reject;
            img2.src = reader.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    };
    img.src = url;
  });
};

/**
 * Genera el certificado PDF con los datos predefinidos
 * @returns {jsPDF} Documento PDF generado
 */
export const generarCertificadoPDF = async () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const datos = DATOS_CERTIFICADO;

  // Colores
  const azulCeleste = [208, 247, 248];
  const azulOscuro = [0, 102, 204];
  const grisOscuro = [60, 60, 60];
  const rojo = [220, 53, 69];
  const grisClaro = [240, 240, 240];

  // Franja azul celeste izquierda (15mm de ancho)
  doc.setFillColor(...azulCeleste);
  doc.rect(0, 0, 15, 280, 'F');

  // Márgenes: 20mm en todos los lados (excepto izquierda donde está la franja)
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 20;
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // Cargar y agregar logos manteniendo proporción
  try {
    const logoArsaData = await imageToBase64WithDimensions('/LogoArsa.png');
    const logoHondurasData = await imageToBase64WithDimensions('/LogoHonduras.png');
    
    // Altura máxima para los logos (20mm - más grandes pero manteniendo simetría)
    const maxHeight = 20;
    
    // Calcular ancho proporcional para Logo ARSA
    const logoArsaAspectRatio = logoArsaData.width / logoArsaData.height;
    const logoArsaWidth = maxHeight * logoArsaAspectRatio;
    
    // Calcular ancho proporcional para Logo Honduras
    const logoHondurasAspectRatio = logoHondurasData.width / logoHondurasData.height;
    const logoHondurasWidth = maxHeight * logoHondurasAspectRatio;
    
    // Logo ARSA - lado izquierdo (después de la franja)
    // Usar 'JPEG' si la imagen fue comprimida como JPEG
    const logoArsaFormat = logoArsaData.base64.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
    doc.addImage(logoArsaData.base64, logoArsaFormat, marginLeft, marginTop, logoArsaWidth, maxHeight);
    
    // Logo Honduras - lado derecho
    const logoHondurasFormat = logoHondurasData.base64.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
    doc.addImage(logoHondurasData.base64, logoHondurasFormat, pageWidth - marginRight - logoHondurasWidth, marginTop, logoHondurasWidth, maxHeight);
  } catch (error) {
    console.warn('No se pudieron cargar los logos:', error);
    // Continuar sin logos si hay error
  }

  // Título principal (más abajo para dejar espacio a los logos más grandes)
  doc.setFontSize(20);
  doc.setTextColor(...grisOscuro);
  doc.setFont(undefined, 'bold');
  doc.text(
    'CERTIFICADO DE REGISTRO SANITARIO',
    pageWidth / 2,
    marginTop + 35,
    { align: 'center' }
  );

  // Texto introductorio
  let yPos = marginTop + 50;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...grisOscuro);
  
  const textoIntro1 = 'LA AGENCIA DE REGULACIÓN SANITARIA, EN USO DE SUS FACULTADES QUE LA LEY LE CONFIERE, MEDIANTE';
  const textoIntro2 = `RESOLUCIÓN: ${datos.fecha_resolucion_legal}, DE FECHA: ${datos.FECHA_INICIO_C}.`;
  
  const introLines1 = doc.splitTextToSize(textoIntro1, contentWidth);
  doc.text(introLines1, marginLeft, yPos);
  yPos += introLines1.length * 5 + 3;
  
  doc.text(textoIntro2, marginLeft, yPos, { maxWidth: contentWidth });
  yPos += 8;

  // Número de registro (en caja)
  doc.setFillColor(...grisClaro);
  doc.roundedRect(marginLeft, yPos, contentWidth, 15, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setTextColor(...grisOscuro);
  doc.setFont(undefined, 'normal');
  doc.text('Número de registro sanitario asignado:', marginLeft + 5, yPos + 7);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...azulOscuro);
  doc.text(datos.CODIGO, pageWidth / 2, yPos + 13, { align: 'center' });
  yPos += 20;

  // Autorización
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...grisOscuro);
  const autorizacionLines = doc.splitTextToSize(
    'Se ha autorizado el NUEVO REGISTRO SANITARIO DE PRODUCTOS COSMÉTICOS',
    contentWidth
  );
  doc.text(autorizacionLines, marginLeft, yPos);
  yPos += autorizacionLines.length * 5 + 5;

  // Fecha de vencimiento (en caja)
  doc.setFillColor(...grisClaro);
  doc.roundedRect(marginLeft, yPos, contentWidth, 15, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setTextColor(...grisOscuro);
  doc.setFont(undefined, 'normal');
  doc.text('Vigente hasta:', marginLeft + 5, yPos + 8);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...rojo);
  doc.text(datos.fecha_fin_legal, pageWidth / 2, yPos + 12, { align: 'center' });
  yPos += 20;

  // Datos del Registro
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...grisOscuro);
  doc.text('Datos del Registro:', marginLeft, yPos);
  yPos += 8;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);

  const datosRegistro = [
    `Nombre comercial: ${datos.nombre_producto}`,
    `Forma cosmética: ${datos.forma_cosmetica_producto}`,
    `Presentación del Producto: ${datos.presentacion_comercial}`,
    `Titular: ${datos.nombre_titular}`,
    `Fabricantes: ${datos.nombre_fabricante_producto}`,
    `Nombre del distribuidor: ${datos.nombre_distribuidor}`,
    `Nombre del profesional responsable: ${datos.nombre_profesional}`,
  ];

  datosRegistro.forEach((linea) => {
    const lineas = doc.splitTextToSize(linea, contentWidth);
    doc.text(lineas, marginLeft, yPos);
    yPos += lineas.length * 5 + 2;
  });

  // Observaciones
  yPos += 5;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('Observaciones:', marginLeft, yPos);
  yPos += 7;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  const observacionesLines = doc.splitTextToSize(datos.observaciones, contentWidth);
  doc.text(observacionesLines, marginLeft, yPos);
  yPos += observacionesLines.length * 5 + 8;

  // Cláusula de cancelación
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('Cláusula de cancelación:', marginLeft, yPos);
  yPos += 7;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  const clausulaLines = doc.splitTextToSize(datos.clausula_cancelacion, contentWidth);
  doc.text(clausulaLines, marginLeft, yPos);
  yPos += clausulaLines.length * 5 + 15;

  // Firma (con suficiente espacio después de la cláusula)
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  // Asegurar que la firma esté al menos a 20mm del final de la página
  const firmaYPos = Math.max(yPos, pageHeight - 20);
  doc.text('Firma Gerente de Arsa', marginLeft, firmaYPos);

  return doc;
};

/**
 * Genera el PDF y lo convierte a Blob para preview
 * @returns {Promise<Blob>} Blob del PDF
 */
export const generarPDFBlob = async () => {
  const doc = await generarCertificadoPDF();
  return doc.output('blob');
};

/**
 * Genera el PDF y lo convierte a base64 para envío
 * @returns {Promise<string>} Base64 del PDF
 */
export const generarPDFBase64 = async () => {
  const doc = await generarCertificadoPDF();
  return doc.output('datauristring');
};
