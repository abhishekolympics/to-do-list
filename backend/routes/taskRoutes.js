const express = require('express');
const { getAllTasks, addTask, deleteTask, updateTask } = require('../controllers/taskController');
const authenticateSession = require('../middleware/authenticateSession');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', authenticateSession, getAllTasks);

// @route   POST /api/tasks
// @desc    Add a new task
// @access  Private
router.post('/', authenticateSession, addTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', authenticateSession, deleteTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', authenticateSession, updateTask);

module.exports = router;
