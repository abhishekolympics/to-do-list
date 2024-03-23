const Task = require('../models/Task');

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Add a new task
const addTask = async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = new Task({ title, user: req.user.id });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    // Ensure the user owns the task before deletion
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    let task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    // Ensure the user owns the task before updating
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    task = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllTasks,
  addTask,
  deleteTask,
  updateTask
};
