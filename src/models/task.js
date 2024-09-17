const mongoose = require('mongoose');

const taskScheme = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskScheme);

module.exports = Task;