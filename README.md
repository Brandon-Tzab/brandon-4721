# Sistema de caracoles

Aplicación de apuestas simuladas en carreras de caracoles. Frontend en React + TypeScript, backend en Express + TypeScript, persistencia de usuario/sesión/saldo en `localStorage`.

## Requisitos

- Node.js 20+ y npm.

## Cómo ejecutar

Cada servicio es independiente, con su propio `package.json`.

### Backend

```
cd server
npm install
copy .env.example .env
npm run dev
```

Queda escuchando en `http://localhost:4000`.

### Frontend

```
cd client
npm install
copy .env.example .env
npm run dev
```

Queda escuchando en `http://localhost:5173`.

### Ambos a la vez (opcional)

Desde la raíz del repo:

```
npm install
npm run dev
```

## Cómo correr las pruebas

```
cd server && npm test
cd client && npm test
```

## SnailPay: cómo reproducir cada respuesta simulada

_Pendiente de completar conforme se implemente el servicio (ver plan de trabajo)._

## Estado del proyecto

_Pendiente — se actualizará con funcionalidades terminadas y pendientes antes de la entrega final._
