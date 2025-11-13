/**
 * Servidor de desarrollo para ejecutar funciones serverless localmente
 * Este servidor solo se usa en desarrollo local
 * 
 * Uso: npm run dev:server (en una terminal separada)
 * O: npm run dev:all (ejecuta ambos servidores)
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local explícitamente
dotenv.config({ path: join(__dirname, '.env.local') });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Manejar OPTIONS para CORS preflight
app.options('/api/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// Importar y usar la función serverless
app.post('/api/send-certificate', async (req, res) => {
  try {
    // Importar dinámicamente la función
    const handler = (await import('./api/send-certificate.js')).default;
    
    // Crear objetos req y res compatibles con Vercel
    const vercelReq = {
      method: req.method,
      body: req.body,
      headers: req.headers,
    };

    let statusCode = 200;
    let headers = {};
    let responseData = null;
    let responseEnded = false;

    const vercelRes = {
      status: (code) => {
        statusCode = code;
        return vercelRes;
      },
      json: (data) => {
        if (!responseEnded) {
          responseData = data;
          Object.keys(headers).forEach(key => {
            res.setHeader(key, headers[key]);
          });
          res.status(statusCode).json(data);
          responseEnded = true;
        }
        return vercelRes;
      },
      end: () => {
        if (!responseEnded) {
          Object.keys(headers).forEach(key => {
            res.setHeader(key, headers[key]);
          });
          res.status(statusCode).end();
          responseEnded = true;
        }
        return vercelRes;
      },
      setHeader: (name, value) => {
        headers[name] = value;
        return vercelRes;
      },
    };

    await handler(vercelReq, vercelRes);

    // Si la respuesta no se envió, enviar una respuesta por defecto
    if (!responseEnded) {
      res.status(500).json({ error: 'La función no envió respuesta' });
    }
  } catch (error) {
    console.error('[server-dev] Error al ejecutar función:', error.message);
    console.error('[server-dev] Stack completo:', error.stack);
    console.error('[server-dev] Tipo de error:', error.constructor.name);
    
    // Enviar respuesta de error más detallada
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message,
        type: error.constructor.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`[server-dev] Servidor de desarrollo ejecutándose en http://localhost:${PORT}`);
  console.log(`[server-dev] Las funciones API están disponibles en http://localhost:${PORT}/api`);
  console.log(`[server-dev] Asegúrate de que Vite esté ejecutándose en el puerto 3000`);
  console.log(`[server-dev] Variables de entorno cargadas:`);
  console.log(`[server-dev]   RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✓ Configurada' : '✗ No configurada'}`);
  console.log(`[server-dev]   RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL || '✗ No configurada (usará onboarding@resend.dev)'}`);
});

