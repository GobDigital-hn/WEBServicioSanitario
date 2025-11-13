/**
 * Vercel Serverless Function para enviar certificado por email usando Resend
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local explícitamente (solo en desarrollo local)
// En Vercel, las variables de entorno se cargan automáticamente
if (process.env.NODE_ENV !== 'production') {
  try {
    dotenv.config({ path: join(__dirname, '..', '.env.local') });
    console.log('[send-certificate] Variables de entorno cargadas desde .env.local');
  } catch (err) {
    console.warn('[send-certificate] No se pudo cargar .env.local:', err.message);
  }
}

const resend = new Resend(
  process.env.RESEND_API_KEY || 're_ctFX9jMr_LT2GvuWr3vXA1u9hcSs2G7oz'
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('[send-certificate] Iniciando proceso de envío de email');
    const { email, pdfData, certificateNumber } = req.body;

    if (!email || !isValidEmail(email)) {
      console.error('[send-certificate] Email inválido recibido:', email);
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!pdfData) {
      console.error('[send-certificate] No se proporcionaron datos del PDF');
      return res.status(400).json({ error: 'No se proporcionaron datos del PDF' });
    }

    console.log('[send-certificate] Validaciones pasadas. Email destino:', email);
    console.log('[send-certificate] Tamaño del PDF (base64):', pdfData.length, 'caracteres');

    let pdfBase64Clean = pdfData;
    if (pdfData.includes(',')) {
      pdfBase64Clean = pdfData.split(',')[1];
    }

    const pdfSizeMB = (pdfBase64Clean.length / 1024 / 1024).toFixed(2);
    console.log('[send-certificate] PDF base64 procesado');
    console.log('[send-certificate] Tamaño del PDF:', pdfSizeMB, 'MB');
    
    if (pdfBase64Clean.length > 25 * 1024 * 1024) {
      console.error('[send-certificate] PDF demasiado grande para Resend');
      return res.status(400).json({ 
        error: 'El PDF es demasiado grande',
        details: `El PDF tiene ${pdfSizeMB}MB. El límite de Resend es 25MB.`
      });
    }

    const emailHtml = generarEmailHTML({
      certificateNumber: certificateNumber || 'PF010-2025-000000',
      supportEmail: 'soporte@arsa.hn',
    });
    console.log('[send-certificate] Plantilla de email generada correctamente');

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    console.log('[send-certificate] Variables de entorno:');
    console.log('[send-certificate]   NODE_ENV:', process.env.NODE_ENV);
    console.log('[send-certificate]   RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Configurada' : 'NO CONFIGURADA');
    console.log('[send-certificate]   RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'NO CONFIGURADA');
    console.log('[send-certificate] Email desde:', fromEmail);
    console.log('[send-certificate] Email hacia:', email);
    
    // Advertencia si no está usando el dominio verificado
    if (fromEmail === 'onboarding@resend.dev') {
      console.warn('[send-certificate] ⚠️ ADVERTENCIA: No se está usando el dominio verificado.');
      console.warn('[send-certificate] ⚠️ Configura RESEND_FROM_EMAIL en .env.local (local) o en Vercel Dashboard (producción).');
    }
    console.log('[send-certificate] Tamaño del attachment:', pdfBase64Clean.length, 'caracteres base64');
    
    const attachment = {
      filename: 'certificado-registro-sanitario.pdf',
      content: pdfBase64Clean,
    };
    
    console.log('[send-certificate] Attachment preparado, tamaño:', attachment.content.length, 'caracteres');
    console.log('[send-certificate] Preparando envío con Resend...');
    
    let data, error;
    try {
      console.log('[send-certificate] Llamando a resend.emails.send...');
      const result = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Certificado de Registro Sanitario - ARSA',
        html: emailHtml,
        attachments: [attachment],
      });
      
      console.log('[send-certificate] Respuesta de Resend recibida');
      console.log('[send-certificate] Result.data:', result.data);
      console.log('[send-certificate] Result.error:', result.error);
      
      data = result.data;
      error = result.error;
    } catch (sendError) {
      console.error('[send-certificate] Excepción al llamar resend.emails.send:');
      console.error('[send-certificate] Tipo:', sendError.constructor.name);
      console.error('[send-certificate] Mensaje:', sendError.message);
      console.error('[send-certificate] Stack:', sendError.stack);
      console.error('[send-certificate] Error completo:', JSON.stringify(sendError, Object.getOwnPropertyNames(sendError)));
      error = sendError;
    }

    if (error) {
      console.error('[send-certificate] Error detectado al enviar email');
      console.error('[send-certificate] Tipo de error:', typeof error);
      console.error('[send-certificate] Error:', error);
      
      let errorMessage = 'Error al enviar el correo';
      let errorDetails = '';
      
      // Manejar diferentes tipos de errores
      if (error instanceof Error) {
        errorDetails = error.message;
        if (error.message && error.message.includes('testing emails to your own email')) {
          if (fromEmail === 'onboarding@resend.dev') {
            errorMessage = 'Dominio no configurado';
            errorDetails = 'Estás usando el dominio de prueba. Configura RESEND_FROM_EMAIL=noreply@pruebagobiernodigita.site en .env.local y reinicia el servidor.';
          } else {
            errorMessage = 'Error con dominio verificado';
            errorDetails = `Usando ${fromEmail} pero Resend reporta restricción. Verifica que el dominio esté verificado y "Enable Sending" esté activado.`;
          }
        }
      } else if (typeof error === 'object' && error !== null) {
        // Error de Resend API
        errorDetails = error.message || JSON.stringify(error);
        if (error.message && error.message.includes('testing emails')) {
          if (fromEmail === 'onboarding@resend.dev') {
            errorMessage = 'Dominio no configurado';
            errorDetails = 'Configura RESEND_FROM_EMAIL en .env.local';
          } else {
            errorMessage = 'Error con dominio verificado';
            errorDetails = `Verifica el dominio ${fromEmail} en Resend`;
          }
        }
      } else {
        errorDetails = String(error);
      }
      
      console.error('[send-certificate] Retornando error 500:', errorMessage);
      return res.status(500).json({ 
        error: errorMessage,
        details: errorDetails,
        fromEmail: fromEmail,
        errorType: error?.constructor?.name || typeof error
      });
    }

    console.log('[send-certificate] Email enviado exitosamente. Resend ID:', data?.id);

    return res.status(200).json({
      success: true,
      message: 'Certificado enviado exitosamente',
      emailId: data?.id,
    });

  } catch (error) {
    console.error('[send-certificate] Error no controlado en función:');
    console.error('[send-certificate] Tipo:', error?.constructor?.name || typeof error);
    console.error('[send-certificate] Mensaje:', error?.message || String(error));
    console.error('[send-certificate] Stack:', error?.stack);
    console.error('[send-certificate] Error completo:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error?.message || String(error),
      type: error?.constructor?.name || typeof error,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
  }
}

function generarEmailHTML({ certificateNumber, supportEmail }) {
  const fechaEmision = new Date().toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado de Registro Sanitario - ARSA</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, 'Segoe UI', sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
          <tr>
            <td style="padding: 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">
                ¡Certificado Generado Exitosamente!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 24px;">
                Estimado/a Usuario/a:
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 24px;">
                Nos complace informarle que su <strong>Certificado de Registro Sanitario</strong> ha sido generado correctamente en nuestra plataforma.
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 24px;">
                Su certificado con número de registro <strong>${certificateNumber}</strong> ya está disponible y adjunto en este correo electrónico. Este documento certifica oficialmente el registro sanitario de su producto y puede ser utilizado para fines comerciales y legales.
              </p>
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 500;">
                  <strong>Importante:</strong> Le recomendamos guardar una copia de su certificado en un lugar seguro. Este documento es válido por 2 años desde la fecha de emisión.
                </p>
              </div>
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">
                  <strong>Número de Registro:</strong> ${certificateNumber}
                </p>
                <p style="margin: 0; font-size: 14px; color: #374151;">
                  <strong>Fecha de Emisión:</strong> ${fechaEmision}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">
                ¿Necesita Ayuda?
              </h2>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 24px;">
                Si tiene alguna duda sobre su certificado o necesita asistencia técnica, no dude en contactarnos. Nuestro equipo de soporte está aquí para ayudarle.
              </p>
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">
                  <strong>Email de soporte:</strong> ${supportEmail}
                </p>
                <p style="margin: 0; font-size: 14px; color: #374151;">
                  <strong>Horario de atención:</strong> Lunes a Viernes, 8:00 AM - 5:00 PM
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                Gracias por confiar en ARSA - Agencia de Regulación Sanitaria.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} ARSA. Todos los derechos reservados.
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">
                Tegucigalpa, Honduras
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
