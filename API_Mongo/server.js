const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Bitacora = require('./api/models/BitacoraModel'); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://SICAT:P4$$w0rd@sicat.wlcl9ol.mongodb.net/?retryWrites=true&w=majority&appName=SICAT');
    console.log('Conexión a MongoDB exitosa');
    
    // Modelos
    require('./api/models/BitacoraModel');

    // Rutas
    const routes = require('./api/routes/BitacoraRoutes');
    routes(app);

    app.get('/', (req, res) => {
      res.send('API funcionando');
    });

    app.listen(port, () => {
      console.log('Servidor para RESTful API iniciada en puerto ' + port);
    });

    // Realizar la prueba de listado de bitacoras
    (async () => {
      try {
        const bitacoras = await Bitacora.find();
        console.log("Datos de ListarTodasLasBitacoras", bitacoras);
        if (bitacoras.length === 0) {
          console.log("No se encontraron registros en la colección bitacora.");
        }
      } catch (err) {
        console.error("Error al listar las bitacoras:", err);
      }
    })();
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1); // Detener el proceso si no puede conectarse a la base de datos
  }
};

// Llamar a la función para conectar a la base de datos y configurar el servidor
connectDB();
