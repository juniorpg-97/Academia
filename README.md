# AulaNova

Plataforma de cursos creada con React, TypeScript, Vite, Tailwind CSS y la API REST de Aula Funval.

## Requisitos

- Node.js 20.19+ (o 22.12+)
- npm

## Configuración

```bash
npm install
```

Copia `.env.example` como `.env` y configura la URL de la API:

```env
VITE_API_URL=https://api-academia-funval.onrender.com/api
```

La API puede tardar cerca de 50 segundos en responder si estaba inactiva.

## Desarrollo

```bash
npm run dev
```

## Validación de producción

```bash
npm run build
npm run lint
```

## Funcionalidades

- Registro de estudiantes e inicio de sesión con sesión persistente.
- Inicio personalizado para estudiantes y administradores.
- Catálogo de cursos con búsqueda, cupos e información del docente.
- Detalle de curso e inscripción conectados a la API.
- Inscripciones del estudiante y estados de carga, error y reintento.
- Rutas privadas, navegación adaptable y página 404.

La documentación del servicio está disponible en [API Docs](https://api-academia-funval.onrender.com/api/docs).
