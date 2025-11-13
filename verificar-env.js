/**
 * Script para verificar que las variables de entorno estén configuradas
 * Ejecutar: node verificar-env.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local explícitamente
dotenv.config({ path: join(__dirname, '.env.local') });

console.log('=== Verificación de Variables de Entorno ===\n');

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

console.log('RESEND_API_KEY:', apiKey ? '✓ Configurada' : '✗ NO CONFIGURADA');
if (apiKey) {
  console.log('  Valor:', apiKey.substring(0, 10) + '...');
}

console.log('\nRESEND_FROM_EMAIL:', fromEmail ? '✓ Configurada' : '✗ NO CONFIGURADA');
if (fromEmail) {
  console.log('  Valor:', fromEmail);
} else {
  console.log('  ⚠️  Se usará: onboarding@resend.dev (dominio de prueba)');
}

console.log('\n=== Estado ===');
if (apiKey && fromEmail) {
  console.log('✓ Todo configurado correctamente');
  console.log('✓ Puedes enviar a cualquier email con tu dominio verificado');
} else if (apiKey && !fromEmail) {
  console.log('⚠️  API Key configurada pero falta RESEND_FROM_EMAIL');
  console.log('⚠️  Solo podrás enviar a tu propio email');
  console.log('\nPara solucionarlo:');
  console.log('1. Crea el archivo .env.local en la raíz del proyecto');
  console.log('2. Agrega: RESEND_FROM_EMAIL=noreply@pruebagobiernodigita.site');
  console.log('3. Reinicia el servidor');
} else {
  console.log('✗ Variables de entorno no configuradas');
  console.log('\nPara solucionarlo:');
  console.log('1. Crea el archivo .env.local en la raíz del proyecto');
  console.log('2. Agrega:');
  console.log('   RESEND_API_KEY=re_ctFX9jMr_LT2GvuWr3vXA1u9hcSs2G7oz');
  console.log('   RESEND_FROM_EMAIL=noreply@pruebagobiernodigita.site');
  console.log('3. Reinicia el servidor');
}

