const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyToken = require('../middleware/verifyToken')

router.post('/createTask', verifyToken, taskController.createTask);
router.get('/tasks', verifyToken, taskController.getTasks);
router.get('/task/:id', verifyToken, taskController.getTaskById);
router.put('/updateTask/:id', verifyToken, taskController.updateTaskById);
router.delete('/deleteTask/:id', verifyToken, taskController.deleteTaskById);

module.exports = router;