const express = require('express');
const bodyParser = require('body-parser');
const orderController = require('./interfaces/http/OrderController'); // Ajusta esta ruta si es necesario

const connectDB = require('./config/index')

const app = express();
app.use(bodyParser.json());

connectDB()
  .then(() => {
    console.log('Conexión inicializada');
    // Aquí puedes empezar a manejar tus rutas o lógica de negocio
  })
  .catch((error) => {
    console.error('Error al inicializar la conexión:', error);
  });

// Definir la ruta de tu función
app.post('/ml/check/stock', orderController);

// Exportar la aplicación Express para que la función pueda ser utilizada
module.exports = {app};
