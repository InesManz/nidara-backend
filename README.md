# CUIDA·NET — Backend (API REST)

API del proyecto **CUIDA·NET**, una aplicación para coordinar el cuidado de
personas mayores en familia. Construida con **Node.js + Express + MongoDB
(Mongoose)**.

## Requisitos previos
- Node.js 18+
- Una base de datos MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/atlas) gratis)

## Puesta en marcha

```bash
npm install
cp .env.example .env      # y rellena MONGODB_URI y JWT_SECRET
npm run generate          # genera data/cuidanet_seed.xlsx y los CSV
npm run seed              # lee los CSV con fs e inserta en la BBDD
npm run dev               # arranca la API en http://localhost:4000
```

## Variables de entorno (`.env`)
| Clave | Descripción |
|-------|-------------|
| `PORT` | Puerto de la API (por defecto 4000) |
| `MONGODB_URI` | Cadena de conexión a MongoDB |
| `JWT_SECRET` | Secreto para firmar los tokens |
| `JWT_EXPIRES_IN` | Caducidad del token (ej. `7d`) |
| `CLIENT_URL` | Origen permitido por CORS (URL del frontend) |

## Datos iniciales (seed)
El enunciado pide generar la BBDD a partir de un Excel. El flujo es:

1. `src/seed/generateExcel.js` crea `data/cuidanet_seed.xlsx` con 5 hojas y
   exporta cada una a **CSV**.
2. `src/seed/seed.js` **lee los CSV con el módulo `fs`** (`src/utils/csv.js`),
   resuelve las relaciones entre colecciones y los inserta con Mongoose.

Volumen: **12 usuarios + 120 registros** en colecciones relacionadas
(12 dependientes, 48 medicamentos, 42 tareas, 18 citas).

## Modelo de datos y relaciones
```
User (usuarios)
  └─ es cuidador de ─► Dependent (dependientes)
                          ├─► Medication  (medicamentos)   [ref dependiente]
                          ├─► Task         (tareas)          [ref dependiente + asignado→User]
                          └─► Appointment  (citas)           [ref dependiente]
```
Hay **cuatro colecciones relacionadas además de la de usuarios**, superando el
mínimo exigido (dos).

## Endpoints principales
| Método | Ruta | Protección |
|--------|------|-----------|
| POST | `/api/auth/register` | pública |
| POST | `/api/auth/login` | pública |
| GET | `/api/auth/me` | sesión |
| GET/POST | `/api/dependientes` | sesión |
| DELETE | `/api/dependientes/:id` | rol `coordinador` |
| GET/POST | `/api/medicamentos` | sesión |
| PATCH | `/api/medicamentos/:id/confirmar` | sesión |
| GET/POST/PATCH/DELETE | `/api/tareas` | sesión |
| GET/POST/DELETE | `/api/citas` | sesión |

## Autenticación y autorización
- Contraseñas hasheadas con **bcrypt** (hook `pre('save')`).
- **JWT** en el header `Authorization: Bearer <token>`.
- Middleware `protect` (sesión) y `authorize('coordinador')` (rol).

## Despliegue
Pensado para Render / Railway / Heroku: define las variables de entorno en el
panel y usa `npm start`. Recuerda añadir la URL del frontend en `CLIENT_URL`.

## Estructura
```
src/
  config/db.js          conexión a MongoDB
  models/               esquemas Mongoose
  controllers/          lógica de cada recurso
  routes/               definición de endpoints
  middleware/           auth (JWT + roles) y errores
  seed/                 generateExcel.js + seed.js
  utils/csv.js          lectura de CSV con fs
  app.js  server.js
data/                   Excel + CSV de semilla
```
