const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');



const app = express();
const port = 3000; // El puerto del API Gateway

app.use(bodyParser.json());

// Middleware de proxy para el Servicio de Usuarios
// app.use('/api/usuarios', createProxyMiddleware({
//     target: 'http://localhost:3001', // La URL de tu Servicio de Usuarios
//     changeOrigin: true,
//     pathRewrite: {
//         '^/api/usuarios': '/users', // Redirige /api/usuarios a /users
//     },
// }));

// Middleware de proxy para el Servicio de Pagos
app.use('/api/pagos', createProxyMiddleware({
    target: 'http://localhost:3002', // La URL de tu Servicio de Pagos
    changeOrigin: true,
    pathRewrite: {
        '^/api/pagos': '/payments', // Redirige /api/pagos a /payments
    },
}));


app.use('/api/reportes', createProxyMiddleware({
    target: 'http://localhost:8001',
    changeOrigin: true,
}))

// Iniciar el servidor del API Gateway
app.listen(port, () => {
    console.log(`API Gateway escuchando en http://localhost:${port}`);
});