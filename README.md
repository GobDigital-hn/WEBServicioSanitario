# Prototipo ARSA - Trámite PF010

Prototipo funcional del sistema de trámites en línea para ARSA (Agencia de Regulación Sanitaria de Honduras).

## 📋 Descripción

Este proyecto es un **mockup funcional** que demuestra el flujo completo del trámite **PF010 - Nuevo Certificado Registro Sanitario de Productos Cosméticos**.

### Características

- ✅ Autenticación simulada
- ✅ Dashboard con trámites disponibles, vigentes y archivados
- ✅ Formulario completo con validaciones
- ✅ Simulación de fases de revisión (SAC, Técnico, Legal, Emisión)
- ✅ Generación de certificado PDF
- ✅ Envío de certificado por correo electrónico (simulado)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# El servidor se iniciará en http://localhost:3000
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint

# Formatear código
npm run format
```

## 📁 Estructura del Proyecto

```
arsa-tramite-prototype/
├── api/                    # Funciones serverless (Vercel)
│   └── send-certificate.js
├── public/                 # Archivos estáticos
│   ├── LogoArsa.png
│   └── LogoHonduras.png
├── src/
│   ├── components/         # Componentes React
│   │   ├── auth/          # Login y rutas protegidas
│   │   ├── dashboard/     # Menú principal
│   │   ├── formulario/    # Formulario de solicitud
│   │   ├── simulacion/    # Simulación de fases
│   │   └── ui/            # Componentes UI reutilizables
│   ├── context/           # Context API (estado global)
│   ├── data/              # Datos estáticos
│   ├── styles/            # Estilos globales
│   ├── utils/             # Utilidades (generador PDF)
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Punto de entrada
└── package.json
```

## 🎯 Flujo de la Aplicación

1. **Login**: Usuario ingresa credenciales (cualquier credencial funciona en el prototipo)
2. **Dashboard**: Muestra trámites disponibles, vigentes y archivados
3. **Formulario**: Usuario completa el formulario de solicitud
4. **Simulación**: Se simulan las fases de revisión automáticamente
5. **Certificado**: Se genera el PDF y se ofrece enviar por correo o descargar

## ⚠️ Notas Importantes

### Datos Estáticos

- **Todo es estático**: Los datos están hardcodeados en el código
- **No hay base de datos**: No se persisten datos entre sesiones
- **Autenticación simulada**: Cualquier credencial funciona
- **PDF con datos hardcodeados**: El certificado usa datos de ejemplo, no del formulario

### Envío de Email

La función serverless `/api/send-certificate` está configurada para **simular** el envío de email. Para producción, necesitarás:

1. Configurar un servicio de email (Resend, SendGrid, etc.)
2. Agregar las variables de entorno necesarias
3. Actualizar el código en `api/send-certificate.js`

## 🛠️ Stack Tecnológico

- **React 18+**: Framework principal
- **React Router v6**: Navegación
- **Vite**: Build tool
- **Framer Motion**: Animaciones
- **jsPDF**: Generación de PDFs
- **Axios**: Cliente HTTP
- **Vercel Functions**: Serverless para email

## 📝 Desarrollo

### Convenciones de Código

- Componentes funcionales con hooks
- CSS Modules para estilos
- camelCase para variables/funciones
- PascalCase para componentes
- UPPER_SNAKE_CASE para constantes

### Estructura de Componentes

```jsx
import React, { useState } from 'react';
import styles from './Component.module.css';

const Component = () => {
  // 1. Hooks de estado
  const [state, setState] = useState(initialValue);
  
  // 2. Handlers
  const handleAction = () => {
    // Lógica
  };
  
  // 3. Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};

export default Component;
```

## 🚢 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

El proyecto está configurado para Vercel con:
- Build automático
- Funciones serverless en `/api`
- Routing SPA configurado

## 📚 Documentación

Para más detalles técnicos, consulta la [Guía de Desarrollo](./GUIA_DESARROLLO.md).

## 📄 Licencia

Este es un prototipo académico para la clase de Gobierno Electrónico.

---

**Desarrollado para ARSA - Agencia de Regulación Sanitaria de Honduras**

