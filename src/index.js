const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

const users = [];

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const userExists = users.find(user => user.username === username);
        if (userExists) {
            return res.status(400).json( { message: 'Usuario ya registrado' } );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { username, password: hashedPassword };
        users.push(newUser);

        res.status(201).json( { message: 'Usuario registrado correctamente' } );
    } catch (error) {
        res.status(500).json( { message: 'Servidor fuera de servicio' } );
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).json( { message: 'Lo sentimos, sus datos ingresados son incorrectos. Verifique...' } );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json( { message: 'Lo sentimos, sus datos ingresados son incorrectos. Verifique...' } );
        }

        const token = jwt.sign( { username: user.username }, `${process.env.JWT_SECRET}`, { expiresIn: "1d" } );

        res.json(token);
    } catch (error) {
        console.log(error);
        
        res.status(500).json( { message: 'Servidor fuera de servicio' } );
    }
});