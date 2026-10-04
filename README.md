# Sistema de caracoles

Aplicación de apuestas simuladas en carreras de caracoles. Frontend en React + TypeScript, backend en Express + TypeScript, persistencia de usuario/sesión/saldo en `localStorage`.

## Requisitos

- Node.js 24+ y npm (probado con Node v24.14.1).

## Cómo ejecutar

Cada servicio es independiente, con su propio `package.json`.

### Backend

```
cd server
npm install
cp .env.example .env   # Windows (CMD): copy .env.example .env
npm run dev
```

Queda escuchando en `http://localhost:4000`.

### Frontend

```
cd client
npm install
cp .env.example .env   # Windows (CMD): copy .env.example .env
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

## Funcionalidades

- Registro, inicio de sesión y cierre de sesión (simulados localmente, con hash de contraseña vía bcrypt en el backend).
- Sesión y saldo persistentes tras recargar la página.
- Dashboard con nombre de usuario, saldo actual, gráfica de apuestas ganadas/perdidas (donut) y gráfica de victorias por caracol (barras), con datos simulados.
- Recarga de saldo mediante SnailPay (pasarela de pagos simulada, ver más abajo), con la última transacción (incluyendo tarjeta/CVV ficticios) persistida en `localStorage`.

## SnailPay: cómo reproducir cada respuesta simulada

Endpoint: `POST /api/snailpay/charge`, con body JSON:

```json
{
  "payerId": "string",
  "payerEmail": "string",
  "cardNumber": "string (16 dígitos)",
  "expirationDate": "string (MM/AA)",
  "cvv": "string (3 dígitos)",
  "fullName": "string",
  "amount": "number (mayor a 0)"
}
```

Todas las respuestas (sin importar el resultado) incluyen: `id`, `status`, `status_detail`, `transaction_amount`, `date_created`, `authorization_code`, `reference`, `payer_id`, `payer_email`, y el `cardNumber`/`cvv` ficticios recibidos.

| Escenario | Cómo provocarlo | `status` | HTTP |
|---|---|---|---|
| Cobro exitoso | `cardNumber: "1234123412341234"`, `expirationDate: "12/26"`, `cvv: "543"`, monto > 0, nombre no vacío | `approved` | 200 |
| Error de sistema | `cardNumber: "0000000000000000"` | `system_error` | 503 |
| Tarjeta rechazada | Cualquier otro número de 16 dígitos distinto al de éxito | `rejected` | 200 |
| Fecha de vencimiento incorrecta | Tarjeta de éxito, pero `expirationDate` distinto a `"12/26"` | `rejected` | 200 |
| CVV incorrecto | Tarjeta y fecha de éxito, pero `cvv` distinto a `"543"` | `rejected` | 200 |
| Datos con formato inválido (ej. tarjeta con menos de 16 dígitos, campos faltantes) | — | — | 400 |

Nota: `rejected` y `approved` responden `200` porque la operación sí se procesó correctamente, solo que el resultado del negocio varía — `400` es exclusivo para cuando los datos ni siquiera tienen el formato correcto, y `503` simula que SnailPay (no el comercio) tiene un problema interno.
