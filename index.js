const express = require('express');
const cors = require("cors");
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes')

require('dotenv').config();
require('./config/database');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(productRouter);

app.listen(process.env.PORT, () =>
    console.log(`Servidor conectado en puerto: ${process.env.PORT}`)
);