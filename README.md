# Prototipo ARSA - Trámite PF010

Prototipo funcional para el trámite **PF010 - Nuevo Certificado Registro Sanitario de Productos Cosméticos** de ARSA (Agencia de Regulación Sanitaria de Honduras).

## 🎯 Descripción

Este proyecto es un prototipo funcional que demuestra el flujo completo de un trámite gubernamental digital, desde el inicio de sesión hasta la generación y envío del certificado PDF por correo electrónico.

## ✨ Características

- **Autenticación**: Sistema de login simulado
- **Dashboard**: Menú principal con visualización de trámites
- **Formulario**: Formulario completo con secciones colapsables
- **Simulación de Fases**: Animación visual de las fases de procesamiento (SAC, Técnica, Legal, Emisión)
- **Generación de PDF**: Certificado generado dinámicamente con jsPDF
- **Envío de Email**: Integración con Resend para envío de certificados por correo

## 🛠️ Tecnologías

- **Frontend**: React 18, React Router v6, Vite
- **Estilos**: CSS Modules
- **Animaciones**: Framer Motion
- **PDF**: jsPDF
- **Email**: Resend API
- **Deployment**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Resend (para envío de emails)
- Dominio verificado en Resend (opcional, para producción)

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/GobDigital-hn/WEBServicioSanitario.git
cd WEBServicioSanitario
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env.local` en la raíz del proyecto:
```env
RESEND_API_KEY=tu_api_key_de_resend
RESEND_FROM_EMAIL=noreply@tudominio.com
```

4. Iniciar servidor de desarrollo:
```bash
npm run dev:all
```

Esto iniciará:
- Servidor Vite en `http://localhost:3000`
- Servidor de desarrollo para API en `http://localhost:3001`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia solo el servidor Vite
- `npm run dev:server` - Inicia solo el servidor de desarrollo para API
- `npm run dev:all` - Inicia ambos servidores simultáneamente
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código con Prettier

## 🌐 Deployment en Vercel

1. Conectar el repositorio a Vercel
2. Configurar variables de entorno en Vercel Dashboard:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
3. Vercel detectará automáticamente la configuración y desplegará la aplicación

## 📁 Estructura del Proyecto

```
arsa-tramite-prototype/
├── api/                 # Funciones serverless de Vercel
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes React
│   ├── context/         # Context API
│   ├── data/           # Datos estáticos
│   ├── styles/         # Estilos globales
│   └── utils/          # Utilidades
├── .env.local          # Variables de entorno (no se sube a Git)
└── vercel.json         # Configuración de Vercel
```

## 📚 Documentación

- `GUIA_DESARROLLO.md` - Guía técnica completa de desarrollo
- `ARQUITECTURA_TECNICA.md` - Arquitectura y tecnologías
- `DIAGRAMA_FLUJO.md` - Diagramas de flujo del proceso
- `CONFIGURAR_VERCEL.md` - Instrucciones para deployment

## ⚠️ Notas Importantes

- Este es un **prototipo funcional**, no un sistema de producción
- Todos los datos son **estáticos** (hardcodeados)
- La autenticación es **simulada** (no hay validación real)
- El PDF se genera con **datos predefinidos**, no del formulario

## 📄 Licencia

Este proyecto es un prototipo académico para la clase de Gobierno Electrónico.

## 👥 Autor

Desarrollado para ARSA - Agencia de Regulación Sanitaria de Honduras
