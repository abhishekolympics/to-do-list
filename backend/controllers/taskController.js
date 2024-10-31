const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  try {
    // Log user ID to verify
    console.log("User ID:", req.user);

    // Fetch tasks for the given user
    const tasks = await Task.find({ user: req.user });

    // Log the number of tasks found
    console.log(`Tasks found: ${tasks.length}`);

    // Respond with the tasks
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Add a new task
const addTask = async (req, res) => {
  try {
    const { title, user, description } = req.body;
    console.log("new task request from fronted side=", req.body);
    const newTask = new Task({ title, user, description });
    const task = await newTask.save();
    console.log("new task is saved correctly == ", task);
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    // Ensure the user owns the task before deletion
    console.log("task.user.toString()=", task.user.toString());
    console.log("req.user=", req.user);
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

// Update a task
const updateTask = async (req, res) => {
  try {
    console.log("id of task for updation=",req.body);
    const { title, completed, description, taskId, userId } = req.body;
    let task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    // Ensure the user owns the task before updating
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
