const express = require('express');
const authRoutes = require('./routes/authRoutes')
require('dotenv').config();
require('./config/db');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});