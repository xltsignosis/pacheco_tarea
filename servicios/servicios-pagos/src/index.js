const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3002; // Puerto único para el Servicio de Pagos

// Middleware para que Express pueda leer JSON en las peticiones
app.use(express.json());

// Configuración de la conexión a la base de datos
// aca igual vas a configurar la base de datos pero ahora con la tabla para los pagos.

const client = new Client({
  user: 'tu_usuario_postgres',
  host: 'localhost',
  database: 'universidad_db',
  password: 'tu_contraseña_postgres',
  port: 5432,
});

// Conectar a la base de datos
client.connect()
  .then(() => console.log('Conectado a la base de datos de pagos'))
  .catch(err => console.error('Error de conexión a la base de datos', err));

// Endpoint para registrar un nuevo pago. Coincide con lo que envía tu frontend.
app.post('/payments', async (req, res) => {
  const { studentId, amount, metodoPago, descripcion, estado, fecha } = req.body;
  if (!studentId || !amount || !metodoPago) {
    return res.status(400).send('Faltan campos obligatorios');
  }

  try {
    const query = 'INSERT INTO payments(student_id, amount, payment_method, description, status, transaction_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [studentId, amount, metodoPago, descripcion, estado, fecha];
    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al procesar el pago:', err);
    res.status(500).send('Error interno del servidor al procesar el pago.');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servicio de Pagos escuchando en http://localhost:${port}`);
});