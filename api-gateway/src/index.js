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

// Iniciar el servidor del API Gateway
app.listen(port, () => {
  console.log(`API Gateway escuchando en http://localhost:${port}`);
});