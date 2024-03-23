const express = require('express');
const { getAllTasks, addTask, deleteTask, updateTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', authMiddleware, getAllTasks);

// @route   POST /api/tasks
// @desc    Add a new task
// @access  Private
router.post('/', authMiddleware, addTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', authMiddleware, deleteTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', authMiddleware, updateTask);

module.exports = router;
