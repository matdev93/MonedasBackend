const express = require('express');
const cors = require("cors");

require('dotenv').config();
require('./config/database');

const app = express();

app.use(cors());


//* middleware
//* app.use(userRouter);
//* app.use(productRouter);

app.listen(process.env.PORT, () =>
    console.log(`Servidor conectado en puerto: ${process.env.PORT}`)
);