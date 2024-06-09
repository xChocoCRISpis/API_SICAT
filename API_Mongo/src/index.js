const express = require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const bitacoraRoute=require('./routes/bitacoraRoutes.js');
const asistenciaRoute=require('./routes/asistenciaRoutes.js');
const checadorRoute = require('./routes/checadorRoutes.js');

const app =express();
const port=process.env.port || 9000;

// middleware
app.use(express.json());
app.use('/bitacora', bitacoraRoute);
app.use('/asistencia', asistenciaRoute);
app.use('/checador', checadorRoute);

// routes
app.get('/',(req,res)=>{
    res.send('todo bien')
})

// mongo
mongoose.connect('mongodb+srv://SICAT:P4$$w0rd@sicat.wlcl9ol.mongodb.net/SICAT?retryWrites=true&w=majority&appName=SICAT')
//mongoose.connect('mongodb+srv://SICAT:P4$$w0rd@sicat.wlcl9ol.mongodb.net/?retryWrites=true&w=majority&appName=SICAT')
.then(()=>console.log('conecto a mongo'))
.catch((error)=>console.error('error'));

app.listen(port,()=>console.log('si funciono, puerto: ',port));

/*http://localhost:9000/api/crear?id_usuario=2&fecha=677576&hora=gvjhgjhjg&accion=hjvhgvhgvhg*/