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

let tasks = [
    { id: 1, title: 'Tarea 1', description: 'Realizar tarea 1', dueDate: '12/09/2024 00:00:00', completed: false },
    { id: 2, title: 'Tarea 2', description: 'Realizar tarea 2', dueDate: '12/09/2024 00:00:00', completed: true },
]

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

        res.json( { token } );
    } catch (error) {
        console.log(error);
        
        res.status(500).json( { message: 'Servidor fuera de servicio' } );
    }
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json( { message: 'Acceso denegado. Token requerido' } );
    }

    jwt.verify(token, `${process.env.JWT_SECRET}`, (err, user) => {
        if (err) {
            return res.status(403).json( { message: 'Token inválido' } );
        }
        req.user = user;
        next();
    });
}

app.get('/tasks', verifyToken, (req, res) => {
    res.json(tasks);
});

app.get('/tasks/:id', verifyToken, (req, res) => {
    const taskFound = tasks.find(t => t.id === parseInt(req.params.id));
    if (!taskFound) {
        return res.status(404).json( { message: 'Tarea no existente' } );
    }
    res.json(taskFound);
});

app.post('/createTask', verifyToken, (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        completed: false,
    }

    tasks.push(newTask);
    res.status(201).json( { message: 'Tarea registrada correctamente', newTask: newTask } );
});

app.put('/updateTask/:id', verifyToken, (req, res) => {
    const taskFound = tasks.find(t => t.id === parseInt(req.params.id))
    if (!taskFound) {
        return res.status(404).json( { message: 'Tarea no existente' } );
    }

    taskFound.title = req.body.title || taskFound.title;
    taskFound.description = req.body.description || taskFound.description;
    taskFound.dueDate = req.body.dueDate || taskFound.dueDate;
    taskFound.completed = req.body.completed !== undefined ? req.body.completed : taskFound.completed;
    res.json( { message: 'Tarea actualizada correctamente', taskUpdated: taskFound } );
});

app.delete('/deleteTask/:id', verifyToken, (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (taskIndex === -1) {
        return res.status(404).json( { message: 'Tarea no existente' } );
    }

    const taskDeleted = tasks.splice(taskIndex, 1);
    res.json( { message: 'Tarea eliminada correctamente', taskDeleted: taskDeleted } );
});