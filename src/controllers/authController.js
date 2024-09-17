const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateAccessToken = require('../utils/generateToken');
const validator = require('../validators/authValidator')

exports.registerUser = async (req, res) => {
    const { error } = validator.validateRegisterForm(req.body);

    if (error) {
        return res.status(400).json( { message: 'Error en la validación de datos', error: error.details[0].message } );
    }
    
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

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userFound = await User.findOne({ username });
        if (!userFound) {
            return res.status(404).json( { message: 'El usuario no existe en la base de datos...' } );
        }

        const isPasswordMatch = await bcrypt.compare(password, userFound.password);
        if (!isPasswordMatch) {
            return res.status(401).json( { message: 'La contraseña es incorrecta, verifique de nuevo...' } );
        }

        const token = generateAccessToken.token(userFound._id);
        res.json({ token });
    } catch (error) {
        res.status(500).json( { message: 'Servidor fuera de servicio' } );
    }
}