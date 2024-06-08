const express = require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const userRoute=require('./routes/user.js');

const app =express();
const port=process.env.port || 9000;

// middleware
app.use(express.json());
app.use('/',userRoute);
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