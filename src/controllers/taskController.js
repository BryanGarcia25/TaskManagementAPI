const Task = require('../models/task');
const validator = require('../validators/taskValidator');

exports.createTask = async (req, res) => {
    
    const { error } = validator.validateTaskForm(req.body);

    if (error) {
        return res.status(400).json( { message: 'Error en la validación de datos', error: error.details[0].message } );
    }

    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            completed: false,
        });
        
        const taskSaved = await newTask.save();
        res.status(201).json( { message: 'Tarea registrada correctamente', task: taskSaved } );
    } catch (error) {
        res.status(500).json( { message: 'Error en el servidor al guardar la tarea' } );
    }

}

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);   
    } catch (error) {
        res.status(500).json( { message: 'Error en el servidor al obtener las tareas' } );
    }
}

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne( { _id: req.params.id } );
        if (!task) {
            res.status(404).json( { message: `La tarea con el id ${req.params.id} no existe` } );
        }
        return res.status(201).json( { task } );
    } catch (error) {
        res.status(500).json( { message: 'Error en el servidor al obtener la tarea' } );
    }
}

exports.updateTaskById = async (req, res) => {
    try {
        const taskUpdated = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                title: req.body.title,
                description: req.body.description,
                dueDate: req.body.dueDate,
                completed: req.body.completed
            },
            {
                new: true
            }
        );

        if (!taskUpdated) {
            return res.status(404).json( { message: `La tarea con el id ${req.params.id} no existe` } );
        }

        return res.status(201).json( { message: 'Tarea actualizada correctamente', task: taskUpdated } );
        
    } catch (error) {
        res.status(500).json( { message: 'Error en el servidor al obtener la tarea' } );
    }
}

exports.deleteTaskById = async (req, res) => {
    try {
        const taskDeleted = await Task.findByIdAndDelete( { _id: req.params.id } );

        if (!taskDeleted) {
            return res.status(404).json( { message: `La tarea con el id ${req.params.id} no existe` } );
        }

        return res.status(201).json( { message: 'Tarea eliminada correctamente', task: taskDeleted } );
        
    } catch (error) {
        res.status(500).json( { message: 'Error en el servidor al obtener la tarea' } );
    }
}