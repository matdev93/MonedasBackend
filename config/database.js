const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB)
.then(() => console.log('Base de datos conectado con exito!!!'))
.catch(()=> console.log('No se logro conectar a la base de datos!!!'));