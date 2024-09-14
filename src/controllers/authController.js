const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json( { message: 'Usuario registrado correctamente' } );
    } catch (error) {
        res.status(500).json( { message: 'Servidor fuera de servicio' } );
    }
}