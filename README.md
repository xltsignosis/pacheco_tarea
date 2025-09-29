
# README Técnico - Sistema Universitario

## Título y Descripción
**Sistema Universitario - Prototipo Funcional de Arquitectura de Microservicios para Gestión de Usuarios y Pagos**

Sistema web que permite la gestión de usuarios universitarios y procesamiento de pagos mediante una arquitectura de microservicios <cite/>.

## Arquitectura Implementada
**Arquitectura:** Microservicios con API Gateway [2](#0-1) 

**Tecnologías principales:**
- **Backend:** Node.js con Express.js [3](#0-2) 
- **Frontend:** React.js [4](#0-3) 
- **Base de datos:** PostgreSQL [5](#0-4) 
- **Proxy:** http-proxy-middleware [6](#0-5) 

## Requisitos Previos
- Node.js v22+
- PostgreSQL
- npm o yarn

## Instalación de Dependencias
```bash
# En cada directorio (api-gateway, servicios, servicios/servicios-pagos, frontend)
npm install
```

## Configuración del Entorno
**Base de datos PostgreSQL:**
- Crear base de datos `universidad_db` [7](#0-6) 
- Configurar credenciales en cada servicio:
  - Usuario: `tu_usuario_postgres` [8](#0-7) 
  - Contraseña: `tu_contraseña_postgres` [9](#0-8) 

**Tablas requeridas:**
- `users` (name, email, password) [10](#0-9) 
- `payments` (student_id, amount, payment_method, description, status, transaction_date) [11](#0-10) 

## Instrucciones para Ejecutar
```bash
# 1. Servicio de Usuarios (puerto 3001)
cd servicios && npm start

# 2. Servicio de Pagos (puerto 3002)
cd servicios/servicios-pagos && npm start

# 3. API Gateway (puerto 3000)
cd api-gateway && npm start

# 4. Frontend
cd frontend && npm start
```

## Endpoints a Probar

### A través del API Gateway (http://localhost:3000)

**Usuarios:**
- **POST** `/api/usuarios` [12](#0-11) 
  - Crea un nuevo usuario
  - Body: `{"name": "Juan", "email": "juan@email.com", "password": "123456"}`

**Pagos:**
- **POST** `/api/pagos` [13](#0-12) 
  - Registra un nuevo pago
  - Body: `{"studentId": 1, "amount": 500, "metodoPago": "tarjeta", "descripcion": "Matrícula", "estado": "completado", "fecha": "2024-01-15"}` [14](#0-13) 

### Endpoints directos de servicios

**Servicio de Usuarios (http://localhost:3001):**
- **POST** `/users` - Crear usuario [15](#0-14) 

**Servicio de Pagos (http://localhost:3002):**
- **POST** `/payments` - Registrar pago [16](#0-15) 

## Notes
El sistema utiliza un patrón de API Gateway que redirige las peticiones a los microservicios correspondientes [17](#0-16) . El frontend React consume estos servicios a través del gateway [18](#0-17) . Es necesario configurar las credenciales de PostgreSQL en cada servicio antes de ejecutar el sistema.

### Citations

**File:** api-gateway/src/index.js (L1-23)
```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000; // El puerto del API Gateway

// Middleware de proxy para el Servicio de Usuarios
app.use('/api/usuarios', createProxyMiddleware({
  target: 'http://localhost:3001', // La URL de tu Servicio de Usuarios
  changeOrigin: true,
  pathRewrite: {
    '^/api/usuarios': '/users', // Redirige /api/usuarios a /users
  },
}));

// Middleware de proxy para el Servicio de Pagos
app.use('/api/pagos', createProxyMiddleware({
  target: 'http://localhost:3002', // La URL de tu Servicio de Pagos
  changeOrigin: true,
  pathRewrite: {
    '^/api/pagos': '/payments', // Redirige /api/pagos a /payments
  },
}));
```

**File:** servicios/src/index.js (L1-6)
```javascript
const express = require('express');
const {request, response} = require('express');
const { Client } = require('pg');

const app = express();
const port = 3001; //aca ponerl el puerto que estes usando
```

**File:** servicios/src/index.js (L14-20)
```javascript
const client = new Client({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});
```

**File:** servicios/src/index.js (L26-26)
```javascript
app.post('/users', async (request, response) => {
```

**File:** servicios/src/index.js (L33-33)
```javascript
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
```

**File:** frontend/src/App.jsx (L1-8)
```javascript
import React from "react";
import UserForm from "./Usuario/UserForm";
import UserList from "./Usuario/UserList";
import PaymentForm from "./Usuario/PaymentForm";
import PaymentList from "./Usuario/PaymentList";
import "./App.css";

export default function App() {
```

**File:** servicios/servicios-pagos/src/index.js (L14-18)
```javascript
  user: 'tu_usuario_postgres',
  host: 'localhost',
  database: 'universidad_db',
  password: 'tu_contraseña_postgres',
  port: 5432,
```

**File:** servicios/servicios-pagos/src/index.js (L27-27)
```javascript
app.post('/payments', async (req, res) => {
```

**File:** servicios/servicios-pagos/src/index.js (L28-28)
```javascript
  const { studentId, amount, metodoPago, descripcion, estado, fecha } = req.body;
```

**File:** servicios/servicios-pagos/src/index.js (L34-34)
```javascript
    const query = 'INSERT INTO payments(student_id, amount, payment_method, description, status, transaction_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
```

**File:** frontend/src/Usuario/UserForm.jsx (L8-8)
```javascript
    await fetch("/api/usuarios", { // Hace una petición HTTP POST al servidor para crear un nuevo usuario.
```
