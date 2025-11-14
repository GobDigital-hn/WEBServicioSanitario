# Guía Didáctica del Código - Prototipo ARSA

## 📚 Índice
1. [Estructura General del Proyecto](#estructura-general)
2. [Punto de Entrada](#punto-de-entrada)
3. [Sistema de Rutas](#sistema-de-rutas)
4. [Componentes Principales](#componentes-principales)
5. [Flujo de Datos](#flujo-de-datos)
6. [Funcionalidades Clave](#funcionalidades-clave)
7. [Archivos de Configuración](#archivos-de-configuración)

---

## 🏗️ Estructura General del Proyecto

```
arsa-tramite-prototype/
├── 📁 src/                    # Código fuente principal
│   ├── 📁 components/         # Componentes React (UI)
│   ├── 📁 context/            # Estado global (Context API)
│   ├── 📁 data/               # Datos estáticos
│   ├── 📁 styles/              # Estilos globales
│   ├── 📁 utils/               # Funciones auxiliares
│   ├── App.jsx                 # Componente principal (rutas)
│   └── main.jsx                # Punto de entrada
│
├── 📁 api/                     # Funciones serverless (Vercel)
├── 📁 public/                  # Archivos estáticos (imágenes)
├── 📁 emails/                  # Plantillas de email (no usadas actualmente)
│
├── package.json                # Dependencias y scripts
├── vite.config.js              # Configuración de Vite
├── vercel.json                 # Configuración de Vercel
└── server-dev.js               # Servidor local para desarrollo
```

---

## 🚀 Punto de Entrada

### `src/main.jsx`
**¿Qué hace?** Es el primer archivo que se ejecuta cuando la aplicación inicia.

```jsx
// Monta la aplicación React en el elemento <div id="root"> del HTML
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

**¿Para qué editar?** Solo si necesitas cambiar cómo se inicializa React (raro).

---

## 🗺️ Sistema de Rutas

### `src/App.jsx`
**¿Qué hace?** Define todas las rutas (páginas) de la aplicación.

**Rutas disponibles:**
- `/login` → Página de inicio de sesión
- `/dashboard` → Menú principal (protegida)
- `/tramite/:id` → Formulario de solicitud (protegida)
- `/` → Redirige automáticamente a `/login`

**¿Para qué editar?**
- Agregar nuevas páginas/rutas
- Cambiar la ruta de redirección inicial
- Modificar qué rutas están protegidas

**Concepto clave:** `ProtectedRoute` envuelve las rutas que requieren estar logueado.

---

## 🧩 Componentes Principales

### 📁 `src/components/auth/` - Autenticación

#### `Login.jsx`
**¿Qué hace?** Página de inicio de sesión.

**Funcionalidad:**
- Muestra formulario de usuario y contraseña
- Al enviar, guarda el usuario en el Context
- Redirige a `/dashboard` si el login es exitoso

**¿Para qué editar?**
- Cambiar el diseño del login
- Agregar validaciones adicionales
- Modificar qué datos se guardan del usuario

#### `ProtectedRoute.jsx`
**¿Qué hace?** Protege rutas que requieren estar logueado.

**Funcionalidad:**
- Verifica si hay un usuario en el Context
- Si no hay usuario → redirige a `/login`
- Si hay usuario → muestra el componente protegido

**¿Para qué editar?** Solo si necesitas cambiar la lógica de protección.

---

### 📁 `src/components/dashboard/` - Menú Principal

#### `MenuPrincipal.jsx`
**¿Qué hace?** Muestra el menú principal con los trámites disponibles.

**Funcionalidad:**
- Lee la lista de trámites de `src/data/tramites.js`
- Muestra cada trámite en una tarjeta (`TramiteCard`)
- Al hacer clic en "Iniciar trámite" → navega a `/tramite/PF010`

**¿Para qué editar?**
- Agregar más trámites (edita `src/data/tramites.js`)
- Cambiar el diseño del menú
- Agregar filtros o búsqueda

#### `TramiteCard.jsx`
**¿Qué hace?** Muestra una tarjeta individual de un trámite.

**¿Para qué editar?** Cambiar cómo se muestra cada trámite en el menú.

---

### 📁 `src/components/formulario/` - Formulario

#### `FormularioSolicitud.jsx`
**¿Qué hace?** Formulario completo para solicitar el trámite PF010.

**Funcionalidad:**
- Muestra secciones colapsables (acordeón)
- Valida campos requeridos
- Al enviar → abre el modal de simulación

**Estructura:**
- Secciones: Información General, Empresa, Producto, Documentos
- Solo 2 campos son requeridos: `nombre_solicitante` y `email`
- Los demás campos son opcionales (para el prototipo)

**¿Para qué editar?**
- Agregar/quitar campos del formulario
- Cambiar qué campos son requeridos
- Modificar validaciones
- Cambiar el diseño de las secciones

**Archivo relacionado:** `src/data/formData.js` (define la estructura del formulario)

---

### 📁 `src/components/simulacion/` - Simulación de Fases

#### `ModalSimulacion.jsx`
**¿Qué hace?** Simula las 4 fases de revisión del trámite.

**Funcionalidad:**
- Se abre automáticamente al enviar el formulario
- Muestra 4 fases en secuencia:
  1. **SAC** (3 segundos)
  2. **Verificación Técnica** (3 segundos)
  3. **Legal** (3 segundos)
  4. **Emisión** (3 segundos)
- Muestra barra de progreso y título de fase activa
- Al terminar → abre `ModalConfirmacionEnvio`

**¿Para qué editar?**
- Cambiar la duración de cada fase
- Agregar/quitar fases
- Modificar los mensajes de cada fase
- Cambiar las animaciones

#### `ModalConfirmacionEnvio.jsx`
**¿Qué hace?** Muestra el certificado generado y permite enviarlo por email.

**Funcionalidad:**
- Genera preview del PDF
- Muestra campo para ingresar email
- Botones: "Enviar por Correo" y "Descargar PDF"
- Al enviar → llama a `/api/send-certificate`

**¿Para qué editar?**
- Cambiar el diseño del modal
- Modificar el mensaje de confirmación
- Agregar validaciones al email

**Archivos relacionados:**
- `src/utils/pdfGenerator.js` (genera el PDF)
- `api/send-certificate.js` (envía el email)

---

### 📁 `src/components/ui/` - Componentes Reutilizables

Componentes genéricos que se usan en toda la aplicación:

- **`Button.jsx`** → Botones estilizados
- **`Modal.jsx`** → Contenedor de modales
- **`LoadingSpinner.jsx`** → Indicador de carga
- **`ProgressBar.jsx`** → Barra de progreso

**¿Para qué editar?** Cambiar el diseño de estos componentes afecta toda la app.

---

## 🔄 Flujo de Datos

### Context API (`src/context/AppContext.jsx`)
**¿Qué hace?** Guarda el estado global de la aplicación.

**Datos que guarda:**
- `usuario`: Información del usuario logueado
- `tramiteActual`: Datos del trámite en proceso

**¿Cómo se usa?**
```jsx
// En cualquier componente:
const { usuario, setUsuario } = useAppContext();
```

**¿Para qué editar?** Agregar más datos globales que necesites compartir entre componentes.

---

## 📊 Datos Estáticos

### `src/data/tramites.js`
**¿Qué hace?** Lista de trámites disponibles.

**¿Para qué editar?** Agregar más trámites al sistema.

### `src/data/formData.js`
**¿Qué hace?** Define la estructura del formulario (campos, validaciones).

**¿Para qué editar?** Modificar qué campos tiene el formulario.

### `src/data/certificadoData.js`
**¿Qué hace?** Datos hardcodeados que se usan para generar el PDF.

**⚠️ IMPORTANTE:** El PDF usa estos datos, NO los datos del formulario.

**¿Para qué editar?** Cambiar los datos que aparecen en el certificado PDF.

### `src/data/constants.js`
**¿Qué hace?** Constantes del sistema (rutas, estados, duraciones).

**¿Para qué editar?** Cambiar valores como duración de fases, rutas, etc.

---

## 🛠️ Funcionalidades Clave

### Generación de PDF (`src/utils/pdfGenerator.js`)
**¿Qué hace?** Genera el certificado PDF usando jsPDF.

**Funciones principales:**
- `generarCertificadoPDF()` → Crea el PDF completo
- `generarPDFBlob()` → Convierte a Blob (para preview)
- `generarPDFBase64()` → Convierte a Base64 (para email)

**¿Para qué editar?**
- Cambiar el diseño del PDF
- Modificar qué datos aparecen
- Ajustar posiciones de texto/logos

**Archivos relacionados:**
- `src/data/certificadoData.js` (datos del PDF)
- `public/LogoArsa.png` y `public/LogoHonduras.png` (logos)

---

### Envío de Email (`api/send-certificate.js`)
**¿Qué hace?** Función serverless que envía el certificado por email usando Resend.

**Funcionalidad:**
- Recibe: email destino, PDF en base64, número de certificado
- Genera HTML del email
- Envía email con PDF adjunto usando Resend API

**¿Para qué editar?**
- Cambiar el diseño del email (HTML)
- Modificar el asunto o contenido
- Agregar más información al email

**Variables de entorno necesarias:**
- `RESEND_API_KEY` → API Key de Resend
- `RESEND_FROM_EMAIL` → Email desde el cual se envía

---

## ⚙️ Archivos de Configuración

### `package.json`
**¿Qué hace?** Define dependencias y scripts del proyecto.

**Scripts importantes:**
- `npm run dev` → Inicia servidor de desarrollo
- `npm run build` → Construye para producción
- `npm run dev:all` → Inicia servidor + API local

**¿Para qué editar?** Agregar nuevas dependencias o scripts.

### `vite.config.js`
**¿Qué hace?** Configuración de Vite (build tool).

**¿Para qué editar?** Cambiar configuración de build, proxies, etc.

### `vercel.json`
**¿Qué hace?** Configuración para deployment en Vercel.

**¿Para qué editar?** Cambiar rutas, configuración de build, etc.

### `server-dev.js`
**¿Qué hace?** Servidor local para probar funciones serverless en desarrollo.

**¿Para qué editar?** Solo si necesitas cambiar cómo se ejecutan las funciones localmente.

---

## 🎨 Estilos

### `src/styles/variables.css`
**¿Qué hace?** Define variables CSS (colores, espaciados, fuentes).

**¿Para qué editar?** Cambiar colores, tamaños, espaciados de toda la app.

### `src/styles/globals.css`
**¿Qué hace?** Estilos globales y clases utilitarias.

**¿Para qué editar?** Agregar estilos globales o clases reutilizables.

### `*.module.css`
**¿Qué hace?** Estilos específicos de cada componente.

**¿Para qué editar?** Cambiar el diseño de componentes específicos.

---

## 🔍 Guía Rápida: ¿Dónde editar X?

| Quiero cambiar... | Edita este archivo |
|-------------------|-------------------|
| Diseño del login | `src/components/auth/Login.jsx` y `Login.module.css` |
| Trámites disponibles | `src/data/tramites.js` |
| Campos del formulario | `src/components/formulario/FormularioSolicitud.jsx` y `src/data/formData.js` |
| Duración de fases | `src/data/constants.js` (DURACION_FASE) |
| Datos del PDF | `src/data/certificadoData.js` |
| Diseño del PDF | `src/utils/pdfGenerator.js` |
| Diseño del email | `api/send-certificate.js` (función `generarEmailHTML`) |
| Colores de la app | `src/styles/variables.css` |
| Agregar nueva página | `src/App.jsx` (rutas) + crear componente |
| Estado global | `src/context/AppContext.jsx` |

---

## 💡 Conceptos Clave para Entender

### 1. **Componentes React**
Cada archivo `.jsx` es un componente (pieza de UI reutilizable).

### 2. **Props**
Datos que se pasan de un componente padre a hijo.

### 3. **State (Estado)**
Datos que cambian dentro de un componente (usando `useState`).

### 4. **Context**
Estado global compartido entre todos los componentes.

### 5. **Rutas**
Diferentes "páginas" de la aplicación (definidas en `App.jsx`).

### 6. **Serverless Functions**
Funciones que se ejecutan en el servidor (en `api/`).

---

## 🚨 Errores Comunes y Soluciones

### "La página está en blanco"
- Verifica la consola del navegador (F12)
- Revisa que todas las rutas estén correctas en `App.jsx`

### "No se envía el email"
- Verifica variables de entorno en Vercel
- Revisa logs en Vercel Dashboard

### "El PDF no se genera"
- Verifica que los logos estén en `public/`
- Revisa la consola del navegador

### "No puedo hacer login"
- Verifica que `AppContext` esté configurado correctamente
- Revisa `ProtectedRoute.jsx`

---

## 📝 Próximos Pasos

1. **Explorar el código:** Abre cada archivo y lee los comentarios
2. **Hacer cambios pequeños:** Prueba cambiar colores, textos, duraciones
3. **Entender el flujo:** Sigue el flujo desde login hasta email
4. **Experimentar:** Crea una copia y prueba modificaciones

---

**¿Dudas sobre algún archivo específico?** Revisa los comentarios dentro del código o pregunta sobre el archivo en particular.

