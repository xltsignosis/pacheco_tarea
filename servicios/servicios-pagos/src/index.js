const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(cors());

// Agregamos body-parser para que Express pueda leer JSON en las peticiones.
app.use(bodyParser.json());
app.use(express.json());

// Configuración de la conexión a la base de datos
const client = new Client({
  user: 'postgre', // <-- ¡IMPORTANTE! Reemplaza con tu usuario real
  host: 'localhost',
  database: 'universidad_db',
  password: 'pachegod', // <-- ¡IMPORTANTE! Reemplaza con tu contraseña real
  port: 5432,
});

// Conectar a la base de datos
client.connect()
  .then(() => console.log('Conectado a la base de datos de pagos'))
  .catch(err => console.error('Error de conexión a la base de datos', err));

// Endpoint para crear un nuevo pago.
app.post('/payments', async (req, res) => {
  const { monto, usuarioId, metodoPago, descripcion, estado, fecha } = req.body;

  if (!monto || !usuarioId || !metodoPago) {
    return res.status(400).send('Faltan campos obligatorios');
  }

  console.log('Recibida petición POST para /payments con los siguientes datos:', req.body); // <-- Debugging

  try {
    const query = 'INSERT INTO payments(student_id, amount, payment_method, description, status, transaction_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [Number(usuarioId), parseFloat(monto), metodoPago, descripcion, estado, fecha];
    const result = await client.query(query, values);

    console.log('Pago procesado con éxito. ID:', result.rows[0].id); // <-- Debugging
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al procesar el pago:', err);
    res.status(500).send('Error interno del servidor.');
  }
});

// Endpoint para obtener todos los pagos.
app.get('/payments', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM payments ORDER BY transaction_date DESC');
    console.log('Recibida petición GET para /payments. Se encontraron', result.rows.length, 'pagos.');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener los pagos:', err);
    res.status(500).send('Error interno del servidor.');
  }
});

// Endpoint para actualizar el estado de un pago.
app.put('/payments/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!estado) {
    return res.status(400).send('Falta el campo de estado');
  }

  try {
    const query = 'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *';
    const values = [estado, id];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).send('Pago no encontrado.');
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar el pago:', err);
    res.status(500).send('Error interno del servidor.');
  }
});


app.listen(port, () => {
  console.log(`Servicio de Pagos escuchando en http://localhost:${port}`);
});