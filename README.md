# Proyecto Personal Cliente – Frontend

Aplicación frontend desarrollada en **React y Vite** para el consumo de la *API DE GESTIÓN DE TRABAJOS*.  
Este proyecto forma parte de un sistema completo de gestión de trabajos, usuarios, reportes y alertas, consumiendo el backend mediante API REST con autenticación y roles.

---

## Descripción

Este cliente web implementa la interfaz visual para:

- Inicio de sesión con autenticación JWT
- Visualización y gestión de usuarios
- Visualización y gestión de trabajos según rol
- Creación y visualización de reportes
- Sistema de alertas entre usuarios
- Navegación dinámica

Proyecto desarrollado como **frontend de portfolio**, aplicando buenas prácticas de React moderno.

---

## Estructura del proyecto

Proyecto-Personal-Cliente  
├─ docs  
├─ public   
├─ src  
│ ├─ assets  
│ ├─ components  
│ ├─ context  
│ ├─ helpers
│ ├─ css  
│ ├─ pages  
│ ├─ routes  
│ ├─ App.css  
│ ├─ App.jsx 
│ ├─ index.css  
│ └─ main.jsx  
├─ .env.template  
├─ jsdoc.json  
├─ package.json  
├─ vite.config.js  
└─ README.md  

---

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- React Router
- Axios / Fetch API
- JSDoc
- CSS
- Libreria Leaflet
- React cookie
- Socket.io-client

---

## Instalación

Clona el repositorio desde GitHub:
```
git clone https://github.com/PabloGartzi/Proyecto-Personal-Cliente.git  
cd Proyecto-Personal-Cliente  
```
Instala las dependencias:
```
npm install  
```

---

## Configuración de entorno

Crea el archivo de entorno a partir de la plantilla:
```
cp .env.template .env  
```
Configura las variables necesarias:

VITE_API_URL=https://tu-backend-api.com

---

## Ejecución del proyecto

Inicia el servidor de desarrollo:
```
npm run dev  
```
El proyecto se ejecutará por defecto en:

http://localhost:5173

---

## Autenticación

- Autenticación basada en JWT
- El token se guarda tras el login
- Se envía en cada petición protegida al backend
- Control de acceso en la interfaz según rol de usuario

Roles disponibles:
- admin
- office
- worker

---

## Consumo de API

Ejemplo de funcionamiento:
- Login contra el backend
- Guardado del token
- Peticiones protegidas usando el token
- Manejo de errores y respuestas

---

## Navegación de la aplicación

La aplicación utiliza **React Router** con rutas protegidas según el rol del usuario.  
El acceso a cada sección está controlado mediante el componente `ProtectedRoute`.

---

### Ruta pública

- `/` → Página de login

---

### Rutas de administrador (admin)

Acceso exclusivo para usuarios con rol **admin**.

- `/admin/dashboard` → Panel principal de administración
- `/admin/editUser/:id` → Edición de usuario
- `/admin/createUser` → Creación de usuario

---

### Rutas de oficina (office)

Acceso exclusivo para usuarios con rol **office**.

- `/office/dashboard` → Panel principal de oficina
- `/office/createWork` → Creación de trabajo
- `/office/editWork/:id` → Edición de trabajo

---

### Rutas de trabajador (worker)

Acceso exclusivo para usuarios con rol **worker**.

- `/worker/dashboard` → Panel principal del trabajador
- `/worker/work` → Detalle del trabajo asignado
- `/worker/createReport` → Creación de reporte
- `/worker/editReport/:report_id` → Edición de reporte

---

### Manejo de rutas no válidas

- Cualquier ruta no definida redirige automáticamente a `/` (login)

---

## Documentación

El proyecto incluye configuración para **JSDoc** mediante el archivo `jsdoc.json` para documentar componentes y lógica de la aplicación.

---

## Build de producción

Para generar la versión de producción:
```
npm run build  
```

---

## Buenas prácticas aplicadas

- Componentes reutilizables
- Separación de lógica y vista
- Variables de entorno
- Arquitectura escalable

---

## Licencia

Proyecto de uso libre con fines educativos y de aprendizaje.

---

## Autor

Proyecto desarrollado por **Pablo García**  
Frontend conectado a la *API DE GESTIÓN DE TRABAJOS* como parte de un sistema completo.
