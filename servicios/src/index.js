const express = require('express');
const {request, response} = require('express');
const { Client } = require('pg');

const app = express();
const port = 3001; //aca ponerl el puerto que estes usando


app.use(express.json());


// Configuracion de la conexion a la base de datos
// aca vas a poner todo lo de la base de datos y la configuracion del cliente ya que lo tengas usas npm start.
const client = new Client({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});

client.connect()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error de conexion', err.stack));

app.post('/users', async (request, response) => {
    const {name, email, password} = request.body;
    if (!name || !email || !password) {
        return response.status(400).json({error: 'Faltan datos obligatorios'});
    }

    try {
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, email, password];
        const res = await client.query(query, values);
        res.status(201).json(res.rows[0]);
    } catch (error) {
        console.error('Error al crear el usuario', error);
        response.status(500).json({error: 'Error al crear el usuario'});
    }
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});