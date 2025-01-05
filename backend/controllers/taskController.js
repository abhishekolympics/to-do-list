const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const addTask = async (req, res) => {
  try {
    const { title, user, description } = req.body;
    const newTask = new Task({ title, user, description });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    await Task.findByIdAndDelete(id);
    res.json({ msg: "Task removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, completed, description, taskId, userId } = req.body;
    let task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    if (task.user.toString() !== userId) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    task = await Task.findByIdAndUpdate(
      taskId,
      { title, completed, description },
      { new: true }
    );
    res.status(200).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllTasks,
  addTask,
  deleteTask,
  updateTask,
};
